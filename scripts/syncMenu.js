/**
 * =====================================================
 *  MASTER SYNC: CSV + Storage → Firebase Firestore
 *  Consolidates: uploadMenu, fetchImageUrls, updateImageUrls
 * =====================================================
 */

import { readFileSync, createReadStream } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import csv from "csv-parser";

// ─── Configuration ───────────────────────────────────
const SERVICE_ACCOUNT_PATH = "./serviceAccount.json";
const CSV_FILE_PATH = "./Working menu - Sheet1.csv";
const COLLECTION_NAME = "menu";
const BUCKET_NAME = "junebird-5846d.firebasestorage.app";

// ─── Initialize Firebase ──────────────────────────────
const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: BUCKET_NAME,
});

const db = getFirestore();
const bucket = getStorage().bucket();

// ─── Helper Functions ────────────────────────────────
function parseBoolean(value) {
    if (!value) return false;
    return value.toString().trim().toUpperCase() === "TRUE";
}

function parseNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

function createSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

// ─── Storage Logic: Find & Generate URLs ──────────────
async function getPublicUrl(fileName, storageFiles) {
    if (!fileName) return null;

    // Normalize string: lower case, remove punctuation/special chars, keep only alphanumeric & spaces
    const normalize = (str) => str.toLowerCase().replace(/['"_.-]/g, ' ').replace(/\s+/g, ' ').trim();

    const target = normalize(fileName);
    const targetWithPng = normalize(fileName + ".png");

    // 1. Exact Match (Clean)
    let match = storageFiles.find(f => normalize(f) === target || normalize(f) === targetWithPng);

    // 2. Fuzzy Match: Check if one contains the other (e.g. "salad.png" inside "salad bowl.png")
    if (!match) {
        match = storageFiles.find(f => {
            const normF = normalize(f);
            return normF.includes(target) || target.includes(normF);
        });
    }

    if (match) {
        const file = bucket.file(match);
        // Generate a long-lived signed URL (essentially public)
        const [url] = await file.getSignedUrl({
            action: "read",
            expires: "2030-01-01",
        });
        return url;
    }
    return null;
}

// ─── Main Process ─────────────────────────────────────
async function main() {
    console.log("\n🚀 Starting Master Sync...");

    // 1. List files in Storage once (for efficiency)
    console.log("📂 Scanning Firebase Storage...");
    const [files] = await bucket.getFiles();
    const storageFileNames = files.map(f => f.name);
    console.log(`   Found ${storageFileNames.length} files in storage.`);

    // 2. Read CSV
    console.log("📄 Reading CSV...");
    const rows = [];
    await new Promise((resolve) => {
        createReadStream(CSV_FILE_PATH)
            .pipe(csv())
            .on("data", (row) => rows.push(row))
            .on("end", resolve);
    });
    console.log(`   Found ${rows.length} rows.`);

    // 3. Clear Firestore Collection
    console.log(`🗑️  Clearing collection: ${COLLECTION_NAME}...`);
    const snapshot = await db.collection(COLLECTION_NAME).get();
    for (const doc of snapshot.docs) {
        const sub = await doc.ref.collection("items").get();
        for (const subDoc of sub.docs) await subDoc.ref.delete();
        await doc.ref.delete();
    }

    // 4. Process and Upload
    console.log("📤 Processing and Uploading data...");
    const categories = {};

    for (const row of rows) {
        const cat = (row.category || "Uncategorized").trim();
        if (!categories[cat]) {
            categories[cat] = {
                name: cat,
                slug: createSlug(cat),
                order: parseNumber(row.categoryOrder),
                items: []
            };
        }

        // Resolve Image URL
        let imageUrl = row.image_url;
        if (!imageUrl || imageUrl.startsWith('gs://')) {
            imageUrl = await getPublicUrl(row.fileName, storageFileNames) || "";
        }

        categories[cat].items.push({
            name: (row.name || "").trim(),
            description: (row.description || "").trim(),
            price: parseNumber(row.price),
            fileName: (row.fileName || "").trim(),
            image_url: imageUrl,
            slug: (row.slug || "").trim() || createSlug(row.name),
            isNew: parseBoolean(row.isNew),
            isDeleted: false,
            createdAt: new Date()
        });
    }

    let itemCount = 0;
    for (const catData of Object.values(categories)) {
        const catRef = db.collection(COLLECTION_NAME).doc(catData.slug);

        await catRef.set({
            category: catData.name,
            categoryOrder: catData.order,
            slug: catData.slug,
            itemCount: catData.items.length,
            updatedAt: new Date()
        });

        for (const item of catData.items) {
            await catRef.collection("items").doc(item.slug).set(item);
            itemCount++;
        }
        console.log(`   ✅ Category: ${catData.name} (${catData.items.length} items)`);
    }

    console.log(`\n✨ Sync Complete!`);
    console.log(`   📁 Categories: ${Object.keys(categories).length}`);
    console.log(`   🍽️  Total Items: ${itemCount}\n`);
}

main().catch(err => console.error("💥 Error:", err));
