# เตรียมระบบเชื่อมต่อ ESP32

เอกสารนี้อธิบายส่วนที่เตรียมไว้ก่อนบอร์ดมาถึง และขั้นตอนที่ต้องทำเมื่อมีอุปกรณ์จริง ระบบควบคุมมอเตอร์จริงปิดอยู่โดยค่าเริ่มต้น

## ส่วนที่เตรียมไว้แล้ว

- หน้า **ตู้โชว์อัญมณี** มีโหมดจำลองให้ลองการกดปุ่มและสถานะ โดยระบุชัดว่าไม่ได้สั่งมอเตอร์จริง
- บริการกลาง Cloudflare Worker ใช้ Durable Object เก็บสถานะบอร์ดและคำสั่งหนึ่งชุด
- บอร์ดจะเป็นฝ่ายเชื่อมออกไปทางอินเทอร์เน็ต จึงไม่ต้องเปิดพอร์ตเราเตอร์
- หน้าเว็บอ่านสถานะบอร์ดและจะส่งคำสั่งได้ต่อเมื่อบริการยืนยันว่าบอร์ดออนไลน์ มอเตอร์พร้อม และผ่าน Turnstile
- คำสั่งจำกัดไว้เฉพาะ `rotate_360_once` มีคำสั่งทำงานได้ครั้งละหนึ่งคำสั่ง จำกัดรวมหนึ่งคำสั่งต่อนาที และปฏิเสธคำสั่งซ้อน
- ไม่มีการแสดงว่าหมุนเสร็จจนกว่าบอร์ดจะส่งผลกลับ

## ลองระบบจำลองตอนนี้

เปิดเว็บจากเครื่องตัวเองที่ `http://localhost:4173` แล้วเปิดหน้า **ตู้โชว์อัญมณี** กด **เริ่มโหมดจำลอง** จากนั้นลองกด **หมุนแท่น 360°** หน้าจอจะแสดงสถานะจำลองและย้ำว่าไม่ได้เชื่อมต่อหรือขยับบอร์ดจริง ปุ่มทดสอบนี้จะแสดงเฉพาะเมื่อเปิดเว็บจากเครื่องตัวเอง ไม่แสดงให้ลูกค้าบนเว็บไซต์สาธารณะ

## โค้ด ESP32 ที่เตรียมไว้

โฟลเดอร์ `firmware/esp32` เตรียมโปรไฟล์ PlatformIO แบบ custom สำหรับโมดูล **ESP32-S3-WROOM-1-N16R8** ตาม BOM ที่ส่งมา โดยตั้งค่า Flash 16 MB และ PSRAM แบบ OPI 8 MB พร้อมโค้ดตรวจสถานะทาง Serial และโครง HTTPS polling สำหรับบริการกลาง โปรไฟล์นี้ใช้กับโมดูลบนแผงวงจร custom ไม่ได้หมายความว่าฮาร์ดแวร์จริงเป็นบอร์ด DevKitC-1

- ค่าเริ่มต้นปิดทั้ง `MOTOR_OUTPUT_ENABLED` และ `REMOTE_CONTROL_ENABLED`
- ยังไม่กำหนด GPIO, เวลาหมุน, Wi-Fi, URL บริการกลาง หรือกุญแจอุปกรณ์
- firmware รายงาน `boardProfile` เป็น `esp32-s3-wroom-1-n16r8` ผ่าน USB/Serial เพื่อให้หน้าเชื่อมต่อแสดงรุ่นโมดูลตาม BOM
- คำสั่ง Serial ที่เตรียมไว้คือ `IDENTIFY`, `STATUS` และ `STOP`; ไม่มีคำสั่งเริ่มหมุนเพื่อป้องกันการเคลื่อนที่โดยไม่ตั้งใจ
- ต้องใช้ TLS root CA ที่ถูกต้องเมื่อเชื่อม Cloudflare ห้ามแก้ด้วยการปิดตรวจสอบใบรับรอง

## ศูนย์เชื่อมต่อบอร์ด

หลังเข้าสู่ระบบผู้ดูแล เปิดเมนู **เชื่อมต่อบอร์ด** ได้จากหน้าเว็บ ระบบมีช่องทางตรวจสอบสองแบบ:

- **USB/Serial:** ใช้ Chrome หรือ Edge รุ่นปัจจุบันผ่าน HTTPS หรือ localhost เสียบบอร์ด กด **เลือกและเชื่อมต่อพอร์ต** แล้วเลือกพอร์ตในหน้าต่างเบราว์เซอร์ ผู้ใช้ต้องอนุญาตพอร์ตเอง เว็บจะส่ง `IDENTIFY` และ `STATUS` ที่ไม่ขยับมอเตอร์ ถ้า firmware ไม่ตอบ จะรายงานว่าเปิดพอร์ตได้แต่ยังยืนยัน firmware ไม่ได้
- **Wi-Fi/Cloudflare:** กดตรวจสถานะเพื่ออ่าน heartbeat จาก Worker ช่องทางนี้ใช้ได้เมื่อบอร์ดมี firmware ที่ตั้งค่า Wi-Fi, Worker URL และ `DEVICE_TOKEN` แล้ว

USB-to-Serial ใช้ตรวจพบชิปแปลงพอร์ตได้ แต่ไม่สามารถระบุรุ่นบอร์ดพัฒนา ขา GPIO หรือการต่อสายได้ การระบุโมดูล ESP32-S3-WROOM-1-N16R8 ต้องใช้ firmware โปรไฟล์นี้และคำสั่ง `IDENTIFY` ใน BOM มีช่อง USB-B แต่ยังยืนยันไม่ได้ว่าต่อเข้ากับ USB-to-Serial หรือ USB ภายใน ESP32-S3; ต้องดู schematic ก่อนเลือกวิธีแฟลชหรือสรุปการต่อสาย เว็บไม่สามารถสแกนพอร์ตหรือเชื่อมต่อเงียบ ๆ โดยไม่ให้ผู้ใช้กดอนุญาตได้

ระบบยังไม่รองรับบอร์ดทุกรุ่นโดยอัตโนมัติ แต่ละตระกูลต้องมี firmware โปรไฟล์ build และวิธี provision เครือข่ายที่ตรงกัน การเชื่อม Wi-Fi ไม่ได้ตั้งค่า Wi-Fi ให้บอร์ดจากหน้าเว็บเอง และ ESP32-S3 ไม่มี Ethernet ในตัว

## เชื่อมโปรเจกต์ ThingsBoard ด้วย REST API

หน้า **ความปลอดภัยตู้โชว์** เปิดดูข้อมูลตัวอย่างได้โดยไม่ต้องเข้าสู่ระบบเว็บหรือกรอกรหัส ข้อมูลนี้เป็นข้อมูลจำลองและมีป้ายกำกับชัดเจน ไม่ใช่สถานะจากอุปกรณ์จริง ผู้ดูแลที่เข้าสู่ระบบแล้วสามารถเลือก **เชื่อมต่อ ThingsBoard จริง** และยืนยันสิทธิ์ได้ ข้อมูลจริงยังต้องมีการป้องกันเพราะเป็นสถานะความปลอดภัยของตู้โชว์

เมื่อเลือกข้อมูลจริง Cloudflare Worker จะอ่าน dashboard export `Showroom Security Management` ผ่าน ThingsBoard REST API ไม่เรียกจาก JavaScript ของเว็บ Worker อ่าน asset ที่ตั้งไว้ใน `wrangler.toml`, หาอุปกรณ์ที่เชื่อมด้วย relation `jewelryShowroomTodiamondPedestal`, แล้วอ่าน telemetry ย้อนหลัง 7 วัน

ค่าที่ใช้ในหน้านี้:

- สถานะล่าสุด: `authorized`, `itemPresent`, `coverOpen`, `weight`, `vibration`, `battery`, `dailyMaxVibration`
- attribute: `active`, `maxVibrationThreshold`
- กราฟ 7 วัน: `vibration` และ `dailyMaxVibration`; หน่วยแรงสั่นสะเทือนเป็น mm/s และแบตเตอรี่เป็น %
- ข้อมูลแรงสั่นที่เกิน threshold, ฝาครอบเปิด, ไม่มีเครื่องประดับ, ไม่อนุญาต หรืออุปกรณ์ไม่ทำงาน จะแสดงเป็นเงื่อนไขเตือนจากค่าล่าสุด ไม่ใช่ประวัติ Alarm ที่อ่านจาก ThingsBoard

ก่อนเปิดใช้งาน:

1. ใน ThingsBoard สร้าง Customer สำหรับตู้โชว์ แล้วกำหนด asset และอุปกรณ์ที่เกี่ยวข้องให้ Customer นี้
2. สร้าง Customer user เฉพาะสำหรับอ่านข้อมูล โดยใช้บัญชีที่มีสิทธิ์เฉพาะ Customer ดังกล่าว และเปิดใช้งานบัญชีนั้น
3. ใน Cloudflare Worker จะเข้าสู่ระบบ ThingsBoard ด้วยอีเมลและรหัสผ่านของ Customer user เพื่ออ่านข้อมูล โดยเก็บข้อมูลเข้าสู่ระบบเป็น Worker secrets เท่านั้น ไม่ใช้ JWT ที่คัดลอกจากหน้าเว็บ เพราะ JWT หมดอายุ
4. สร้างรหัสผ่านสุ่มยาวสำหรับหน้าเว็บด้วยคำสั่งนี้ใน PowerShell:

   ```powershell
   py -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

5. ใน Cloudflare Dashboard เปิด Worker `jewelry-gemstone-control` แล้วเพิ่ม Worker secrets:
   - `THINGSBOARD_USERNAME`: อีเมลของ Customer user ที่สร้างไว้
   - `THINGSBOARD_PASSWORD`: รหัสผ่านของ Customer user
   - `SHOWROOM_DASHBOARD_PASSWORD`: รหัสสุ่มจากขั้นตอนก่อนหน้า ใช้กรอกหน้า **ความปลอดภัยตู้โชว์**
6. ตรวจ `THINGSBOARD_URL` และ `SHOWROOM_ASSET_ID` ใน `wrangler.toml` ให้เป็น instance และ asset id ของ dashboard ที่ export มา
7. เปิด GitHub Actions แล้วรัน workflow **เผยแพร่บริการกลาง Cloudflare** หลังเพิ่ม secrets
8. เปิดเว็บ ลงชื่อเข้าใช้ผู้ดูแล เลือก **ความปลอดภัยตู้โชว์** แล้วกด **เชื่อมต่อ ThingsBoard จริง** เพื่อกรอกรหัสผ่านส่วนดูข้อมูล รหัสนี้จะอยู่ในหน่วยความจำของแท็บและต้องกรอกใหม่เมื่อเปิดแท็บใหม่ หากใช้ส่งงานอย่างเดียวให้คงโหมดข้อมูลตัวอย่างได้ ไม่ต้องกรอกรหัส

หลังยืนยันรุ่นบอร์ดจริงแล้ว สามารถติดตั้ง PlatformIO ใน VS Code และลอง build โดยไม่เสียบบอร์ด:

```powershell
cd firmware\esp32
pio run
```

การอัปโหลด/ต่อเซอร์โว/เปิดเอาต์พุตมอเตอร์จะทำหลังเห็นรุ่นบอร์ด ขา GPIO และแหล่งจ่ายจริงก่อนเท่านั้น ค่าตัวอย่าง pulse และเวลาหมุนยังไม่ใช่ค่าที่ปรับเทียบกับแท่นของคุณ

## ภาพรวมการเชื่อมต่อจริง

```text
ลูกค้าเปิดเว็บ GitHub Pages
        ↓ HTTPS
Cloudflare Worker ตรวจคำขอและ Turnstile
        ↓ Durable Object เก็บสถานะ/คิวคำสั่ง
ESP32 ต่อ Wi-Fi แล้วเรียก Worker ออกไปเป็นระยะ
        ↓
ESP32 ควบคุมมอเตอร์และรายงานผลกลับ
```

Worker ใช้ HTTPS polling เพื่อให้เริ่มต้นและทดสอบง่าย:

1. บอร์ดส่ง `POST /device/heartbeat` ทุกประมาณ 5 วินาที เช่น `{"motorReady":true,"pirDetected":false,"firmware":"0.1.0"}`
2. บอร์ดเรียก `GET /device/next` ทุกประมาณ 2 วินาที ถ้าไม่มีงานจะได้ `{"command":null}`
3. เมื่อมีงาน บอร์ดจะได้รับ `{"command":{"id":"...","command":"rotate_360_once","issuedAt":...}}`
4. บอร์ดต้องทำตามโปรไฟล์ที่ทดสอบแล้วและหยุดเองตามเวลาสูงสุดที่ตั้งใน firmware จากนั้นส่ง `POST /device/result` พร้อม `{"commandId":"...","status":"completed"}` หรือ `{"commandId":"...","status":"failed","message":"..."}`

สถานะ `completed` หมายถึง firmware ส่งผลกลับมาเท่านั้น ไม่ใช่การวัดยืนยันมุมด้วย encoder เซอร์โวหมุนต่อเนื่องต้องปรับเทียบเวลาหมุนกับแท่นจริงก่อนจึงจะอ้างว่าหมุนครบหนึ่งรอบได้

คำขอจากบอร์ดทุกเส้นทางต้องมีส่วนหัว `Authorization: Bearer <DEVICE_TOKEN>` ห้ามใส่โทเคนนี้ใน JavaScript ของหน้าเว็บหรือ commit ลง GitHub

## การตั้งค่า Cloudflare และการเผยแพร่บริการ

Cloudflare Worker เผยแพร่แล้วที่ `https://jewelry-gemstone-control.chonlachat-tee2548.workers.dev` และตั้งค่า Turnstile แล้ว ขั้นตอนต่อไปนี้ใช้เมื่อต้องตั้งค่าใหม่หรือเผยแพร่ Worker ซ้ำ:

1. สร้าง API Token ที่มีสิทธิ์จัดการ Workers และคัดลอก Account ID
2. ใน GitHub repository เปิด **Settings > Secrets and variables > Actions** แล้วเพิ่ม secret ชื่อ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID`
3. เปิด **Settings > Actions > General** แล้วอนุญาต workflow ให้ใช้ Actions ตามค่าเริ่มต้น
4. เปิดแท็บ **Actions**, เลือก **เผยแพร่บริการกลาง Cloudflare**, แล้วกด **Run workflow**
5. สร้างค่าสุ่มสำหรับโทเคนบอร์ดด้วย `py -c "import secrets; print(secrets.token_urlsafe(32))"` แล้วใน Cloudflare Dashboard ของ Worker `jewelry-gemstone-control` เพิ่ม Worker secrets ชื่อ `DEVICE_TOKEN` และ `TURNSTILE_SECRET` เก็บค่าโทเคนไว้ในที่ปลอดภัยและห้าม commit ลง GitHub
6. สร้าง Turnstile widget สำหรับ `chonlachattee2548-crypto.github.io` แล้วเพิ่ม Repository secret ชื่อ `TURNSTILE_SITE_KEY` ใน GitHub โดยใส่ Site key ของ widget
7. Workflow GitHub Pages จะสร้าง `device-config.js` ระหว่างเผยแพร่ โดยตั้ง URL Worker และ Site key จาก Secret ให้เอง ไฟล์ที่เผยแพร่มี Site key ให้เบราว์เซอร์ใช้งาน แต่ค่านี้เป็น public key และไม่ใช่รหัสลับ
8. คง `REMOTE_CONTROL_ENABLED = "false"` ไว้จนกว่าจะทดสอบการต่อสาย การหยุดมอเตอร์ และโปรไฟล์หมุนกับอุปกรณ์จริงครบ

ห้ามใส่ Turnstile Secret key, Cloudflare API Token หรือ DEVICE_TOKEN ในโค้ดหน้าเว็บ ไฟล์ตั้งค่าเว็บไซต์ หรือ commit ลง GitHub ให้เก็บ Turnstile Secret key และ DEVICE_TOKEN เป็น Worker secrets ส่วน Cloudflare API Token ให้เก็บใน GitHub Actions secrets เท่านั้น

ก่อนเปิดระบบจริง ให้ตรวจว่า Turnstile ทำงาน, บอร์ดรับเฉพาะคำสั่งที่อนุญาต, มอเตอร์หยุดเองได้เมื่อ Wi-Fi หลุดหรือคำสั่งค้าง และมีวิธีตัดไฟฉุกเฉิน การ timeout ฝั่ง Worker ไม่สามารถรับประกันการหยุดมอเตอร์ที่กำลังหมุนได้

## เมื่อบอร์ดมาถึง

ส่งรูปด้านหน้า/ด้านหลังของแผงวงจร, schematic หรือ pinout, ฉลากเซอร์โว รวมถึงรุ่นกล้องและ PIR ถ้ามี ก่อนต่อมอเตอร์เข้าบอร์ดต้องตรวจแรงดัน ขา GPIO วงจรขับ และแหล่งจ่ายไฟของเซอร์โวให้ตรงรุ่น การแฟลช firmware จริงและเปิด `REMOTE_CONTROL_ENABLED` จะทำหลังทดสอบการหยุดมอเตอร์อย่างปลอดภัยแล้วเท่านั้น

### สถานะที่ยังไม่ได้ทำ

- ยังไม่ได้ตั้งค่า Wi-Fi และ `DEVICE_TOKEN` ลง firmware ของบอร์ดจริง
- ยังไม่มีบอร์ดจริงส่ง heartbeat ให้ Worker
- ยังไม่ได้ตั้งค่า ThingsBoard Customer user credentials และรหัสผ่านหน้า **ความปลอดภัยตู้โชว์** ใน Cloudflare Worker
- ยังไม่ได้ตรวจว่า API user มีสิทธิ์อ่าน asset และอุปกรณ์ของตู้โชว์
- ยังไม่ได้แฟลชหรือทดสอบกับ ESP32, SG90, กล้อง หรือ PIR จริง
- ค่ารุ่นและขาเชื่อมต่อของอุปกรณ์จริงต้องยืนยันจากภาพอุปกรณ์ก่อน
