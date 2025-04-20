// scripts/convert-image-to-webp.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // 讀取 .env 內的 MongoDB 連線字串

import Room from '../src/models/room.js'; // ←請確保你的 model 在這個路徑

async function convertImageToWebp() {
  const mongoUri = process.env.DATABASE || ''; // 你 .env 裡要放 DATABASE
  if (!mongoUri) {
    console.error('❌ 沒有找到 DATABASE，請在 .env 檔案中設定');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('✅ 資料庫連線成功');

  const rooms = await Room.find();
  for (const room of rooms) {
    let changed = false;

    if (room.imageUrl?.endsWith('.png')) {
      room.imageUrl = room.imageUrl.replace('.png', '.webp');
      changed = true;
    }

    if (Array.isArray(room.imageUrlList)) {
      const newList = room.imageUrlList.map((url: string) =>
        url.endsWith('.png') ? url.replace('.png', '.webp') : url
      );
      if (JSON.stringify(newList) !== JSON.stringify(room.imageUrlList)) {
        room.imageUrlList = newList;
        changed = true;
      }
    }

    if (changed) {
      await room.save();
      console.log(`🖼️ 已更新房間: ${room.name}`);
    }
  }

  console.log('🎉 所有房間圖片路徑已轉換為 .webp');
  await mongoose.disconnect();
}

convertImageToWebp().catch((err) => {
  console.error('❌ 發生錯誤', err);
});
