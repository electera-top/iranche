# 🔧 حل مشکل Git Authentication

## مشکل

```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/electera-top/iranche.git/'
```

## علت

GitHub دیگر password authentication را پشتیبانی نمی‌کند. باید از Personal Access Token یا SSH استفاده کنید.

---

## ✅ راه‌حل 1: Public کردن Repository (سریع‌ترین)

اگر مشکلی با public بودن ندارید:

### در GitHub:

1. برو به: https://github.com/electera-top/iranche
2. کلیک روی **Settings** (تنظیمات)
3. پایین صفحه: **Danger Zone**
4. **Change repository visibility**
5. **Change visibility** → **Make public**
6. تایپ کن: `electera-top/iranche` برای تأیید

### در سرور:

```bash
cd /root
git clone https://github.com/electera-top/iranche.git
```

حالا بدون authentication کار می‌کند! ✅

---

## ✅ راه‌حل 2: Personal Access Token (اگر می‌خواهید Private بماند)

### مرحله 1: ساخت Token

1. برو به: https://github.com/settings/tokens
2. کلیک: **Generate new token** → **Generate new token (classic)**
3. توضیحات: `iranche-server-deploy`
4. Expiration: **90 days** یا **No expiration**
5. Select scopes: تیک بزن روی **repo** (همه زیرمجموعه‌هایش)
6. کلیک: **Generate token**
7. **کپی کن token را** (مهم! فقط یک بار نشان داده می‌شود)

Token شبیه این است:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### مرحله 2: در سرور استفاده کن

```bash
cd /root
git clone https://github.com/electera-top/iranche.git
```

وقتی پرسید:
- **Username:** `sadeghgoli`
- **Password:** `توکنی که کپی کردی` ← **نه پسورد GitHub!**

---

## ✅ راه‌حل 3: ذخیره Token برای استفاده‌های آینده

```bash
# فعال کردن credential storage
git config --global credential.helper store

# حالا clone کن
cd /root
git clone https://github.com/electera-top/iranche.git

# Username: sadeghgoli
# Password: [TOKEN شما - نه پسورد!]
```

بعد از اولین بار، دیگر نیازی به وارد کردن token ندارید.

---

## ✅ راه‌حل 4: Token در URL (خودکار، اما کمتر امن)

```bash
# جایگزین کن YOUR_TOKEN را با token واقعی
git clone https://sadeghgoli:YOUR_TOKEN@github.com/electera-top/iranche.git
```

**مثال:**
```bash
git clone https://sadeghgoli:ghp_abc123xyz789@github.com/electera-top/iranche.git
```

⚠️ **هشدار امنیتی:** Token در history shell ذخیره می‌شود.

---

## ✅ راه‌حل 5: SSH Key (برای استفاده طولانی‌مدت)

### مرحله 1: ساخت SSH Key در سرور

```bash
# در سرور
ssh-keygen -t ed25519 -C "server@iranche.com"

# Enter را 3 بار بزن (بدون passphrase)

# نمایش public key
cat ~/.ssh/id_ed25519.pub
```

### مرحله 2: اضافه کردن به GitHub

1. کپی کن محتوای `id_ed25519.pub`
2. برو به: https://github.com/settings/ssh/new
3. Title: `Iranche Server`
4. Key: paste کن public key را
5. **Add SSH key**

### مرحله 3: Clone با SSH

```bash
cd /root
git clone git@github.com:electera-top/iranche.git
```

حالا دیگر نیازی به password یا token نیست! ✅

---

## 🎯 کدام روش را انتخاب کنم?

| روش | سادگی | امنیت | استفاده |
|-----|--------|-------|---------|
| **Public Repository** | ⭐⭐⭐⭐⭐ | - | Repository عمومی |
| **Personal Token** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | یکبار/موقت |
| **Token Stored** | ⭐⭐⭐⭐ | ⭐⭐⭐ | استفاده مکرر |
| **Token in URL** | ⭐⭐⭐⭐⭐ | ⭐⭐ | سریع/موقت |
| **SSH Key** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Production/طولانی‌مدت |

### توصیه:

- **برای این پروژه:** راه‌حل 1 (Public) یا راه‌حل 2 (Token)
- **برای production:** راه‌حل 5 (SSH)

---

## 🔄 بعد از حل مشکل

وقتی repository کلون شد، ادامه دیپلوی:

```bash
cd /root/iranche/deploy
chmod +x *.sh
./full-deploy.sh
```

---

## 🆘 عیب‌یابی

### Token کار نمی‌کند

1. مطمئن شوید scope **repo** را انتخاب کرده‌اید
2. Token منقضی نشده باشد
3. از token استفاده کنید، نه password

### SSH کار نمی‌کند

```bash
# تست اتصال SSH به GitHub
ssh -T git@github.com

# باید ببینید: "Hi username! You've successfully authenticated"
```

اگر خطا داد:

```bash
# بررسی SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### پاک کردن Token از History

```bash
# پاک کردن history
history -c
history -w

# یا فقط آخرین command
history -d $(history | tail -n 2 | head -n 1 | awk '{print $1}')
```

---

## 📝 نکات مهم

1. **Token ≠ Password:** هرگز password GitHub را وارد نکنید، فقط token
2. **Token را ذخیره کنید:** در یک جای امن نگه دارید
3. **Scope کافی:** حتماً **repo** scope را فعال کنید
4. **Expiration:** برای production از "No expiration" استفاده کنید
5. **Security:** برای سرور production حتماً SSH استفاده کنید

---

**موفق باشید!** 🚀

