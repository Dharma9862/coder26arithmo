# Google Play Store Publishing Guide for Arithmo

This app is configured with **Capacitor**, enabling direct compilation into a native Android application package ready for the **Google Play Store**.

---

## 📱 App Metadata & Identifier

- **App Name**: Arithmo — Speed Math & Quantitative Aptitude
- **Package ID (Application ID)**: `com.arithmo.speedmath`
- **Target Platform**: Android 8.0+ (API Level 26 to 34+)
- **Output Format for Play Store**: Android App Bundle (`.aab`)

---

## 🛠️ Step 1: Export / Download the Project

1. In AI Studio, click the **Settings / Export** menu and select **Export to ZIP** or **Push to GitHub**.
2. Unzip or clone the repository to your computer.
3. Open a terminal inside the project root folder.

---

## 🚀 Step 2: Build Web Assets & Generate Android Project

Run the following commands:

```bash
# 1. Install all dependencies
npm install

# 2. Build the optimized production assets
npm run build

# 3. Add the Android native platform (first time only)
npx cap add android

# 4. Sync web build and plugins to Android directory
npx cap sync android
```

---

## 🎨 Step 3: Set App Icon & Splash Screen (1-Click)

Capacitor Assets tool can automatically generate all Android densities (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`):

```bash
# Install asset generator tool
npm install -g @capacitor/assets

# Place a 1024x1024 icon.png and 2732x2732 splash.png in an /assets folder, then run:
npx capacitor-assets generate --android
```

---

## 📢 Step 4: Configure AdMob App ID (Optional)

If you use Google AdMob for Android ads:
1. Open `android/app/src/main/AndroidManifest.xml`.
2. Inside the `<application>` tag, add your AdMob App ID:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID"/>
```

---

## 🔑 Step 5: Generate Signed Android App Bundle (.aab)

1. Open the project in **Android Studio**:
   ```bash
   npx cap open android
   ```
2. Wait for Gradle sync to complete.
3. In the top menu, go to:
   **Build** > **Generate Signed Bundle / APK...**
4. Select **Android App Bundle (.aab)** and click **Next**.
5. Click **Create new...** under *Key store path*:
   - Choose a safe location for your `.jks` keystore file.
   - Enter a secure password, alias name, and validity (25+ years).
   - *Important*: Keep this keystore safe; it is required for future app updates.
6. Select **release** build variant and click **Finish**.
7. Android Studio will generate the signed `.aab` file in:
   `android/app/release/app-release.aab`

---

## 🏪 Step 6: Submit to Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - **App name**: Arithmo: Speed Math & Aptitude
   - **Default language**: English (United States)
   - **App or Game**: Game / Education
   - **Free or Paid**: Free
3. Complete the **Set up your app** checklist:
   - **Privacy Policy URL**: Link to your hosted privacy policy (or use the built-in Privacy Policy view).
   - **App Access**: All functionality is available without special access.
   - **Ads**: Select *Yes, my app contains ads* (if AdMob is active).
   - **Content Rating**: Complete the questionnaire (Rated 3+ / Everyone).
   - **Target Audience**: Age 13+ (or General Audience).
4. Upload Store Assets:
   - **App Icon**: 512 x 512 px PNG (32-bit color).
   - **Feature Graphic**: 1024 x 500 px JPG or PNG.
   - **Phone Screenshots**: At least 4 screenshots (1080 x 1920 px or similar).
5. **Release Track**:
   - Go to **Production** (or **Closed Testing** for 14-day tester requirement for new personal accounts).
   - Click **Create new release**.
   - Upload the `app-release.aab` file.
   - Enter release notes: *"Initial launch of Arithmo - Speed math drills, Vedic mathematics, and quantitative aptitude arena."*
   - Click **Review release** and **Start rollout to Production**!
