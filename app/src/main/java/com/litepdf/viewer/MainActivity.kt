package com.litepdf.viewer

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Bundle
import android.os.ParcelFileDescriptor
import android.provider.OpenableColumns
import android.view.Gravity
import android.view.View
import android.widget.*
import java.io.IOException

class MainActivity : Activity() {
    private var descriptor: ParcelFileDescriptor? = null
    private var renderer: PdfRenderer? = null
    private lateinit var pages: LinearLayout
    private lateinit var home: LinearLayout
    private lateinit var title: TextView
    private lateinit var scroll: ScrollView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.WHITE
        window.navigationBarColor = Color.WHITE
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.WHITE)
        }
        val bar = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            setPadding(18, 10, 18, 10)
        }
        val brand = TextView(this).apply {
            text = "Lite PDF Viewer"
            textSize = 20f
            setTextColor(Color.rgb(28, 28, 32))
            setTypeface(null, 1)
        }
        bar.addView(brand, LinearLayout.LayoutParams(0, -2, 1f))
        bar.addView(Button(this).apply {
            text = "Open PDF"
            setTextColor(Color.rgb(220, 0, 18))
            setOnClickListener { picker() }
        })
        root.addView(bar)

        title = TextView(this).apply {
            text = ""
            textSize = 12f
            setTextColor(Color.DKGRAY)
            setPadding(18, 6, 18, 8)
        }
        root.addView(title)

        home = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(28, 30, 28, 30)
        }
        home.addView(TextView(this).apply {
            text = "PDF"
            textSize = 54f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(225, 0, 18))
            setTypeface(null, 1)
        })
        home.addView(TextView(this).apply {
            text = "Your PDFs, beautifully simple."
            textSize = 22f
            setTextColor(Color.rgb(30, 30, 35))
            setTypeface(null, 1)
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 8)
        })
        home.addView(TextView(this).apply {
            text = "No clutter. No ads. Just open and read."
            textSize = 14f
            setTextColor(Color.GRAY)
            gravity = Gravity.CENTER
            setPadding(0, 4, 0, 24)
        })
        home.addView(Button(this).apply {
            text = "Open a PDF"
            setOnClickListener { picker() }
        })
        root.addView(home, LinearLayout.LayoutParams(-1, 0, 1f))

        scroll = ScrollView(this).apply {
            visibility = View.GONE
            setBackgroundColor(Color.rgb(242, 243, 246))
        }
        pages = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(10, 10, 10, 10)
        }
        scroll.addView(pages)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        incoming(intent)
    }

    override fun onNewIntent(i: Intent) {
        super.onNewIntent(i)
        setIntent(i)
        incoming(i)
    }

    private fun incoming(i: Intent?) {
        val uri = when (i?.action) {
            Intent.ACTION_VIEW -> i.data
            Intent.ACTION_SEND -> {
                @Suppress("DEPRECATION")
                i.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
            }
            else -> null
        }
        if (uri != null) showPdf(uri)
    }

    private fun picker() {
        val i = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "application/pdf"
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        startActivityForResult(i, 7)
    }

    @Deprecated("Legacy callback for broad Android compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 7 && resultCode == RESULT_OK) data?.data?.let { showPdf(it) }
    }

    private fun showPdf(uri: Uri) {
        try {
            closePdf()
            descriptor = contentResolver.openFileDescriptor(uri, "r")
                ?: throw IOException("Cannot open file")
            renderer = PdfRenderer(descriptor!!)
            pages.removeAllViews()
            val pageCount = renderer!!.pageCount
            for (index in 0 until pageCount) {
                val page = renderer!!.openPage(index)
                val width = (resources.displayMetrics.widthPixels -
                    resources.displayMetrics.density * 20).toInt()
                val scale = width.toFloat() / page.width
                val bitmap = Bitmap.createBitmap(
                    width, (page.height * scale).toInt(), Bitmap.Config.ARGB_8888
                )
                bitmap.eraseColor(Color.WHITE)
                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                page.close()
                val image = ImageView(this).apply {
                    setImageBitmap(bitmap)
                    adjustViewBounds = true
                    setBackgroundColor(Color.WHITE)
                    elevation = 3f
                }
                val params = LinearLayout.LayoutParams(-1, -2)
                params.bottomMargin = 14
                pages.addView(image, params)
            }
            val name = contentResolver.query(
                uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null
            )?.use { if (it.moveToFirst()) it.getString(0) else "PDF" } ?: "PDF"
            title.text = "$name  •  $pageCount pages"
            home.visibility = View.GONE
            scroll.visibility = View.VISIBLE
        } catch (e: Exception) {
            closePdf()
            Toast.makeText(this, "Unable to open PDF: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun closePdf() {
        try { renderer?.close() } catch (_: Exception) {}
        try { descriptor?.close() } catch (_: Exception) {}
        renderer = null
        descriptor = null
    }

    override fun onDestroy() {
        closePdf()
        super.onDestroy()
    }
}