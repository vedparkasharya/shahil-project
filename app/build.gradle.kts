plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.litepdf.viewer"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.litepdf.viewer"
        minSdk = 21
        targetSdk = 36
        versionCode = 3
        versionName = "1.0.2"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}