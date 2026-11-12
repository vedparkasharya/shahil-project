package com.litepdf.viewer

import android.app.Activity
import android.content.Intent
import android.graphics.*
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Bundle
import android.os.ParcelFileDescriptor
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
    private val red = Color.rgb(224, 0, 18)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.WHITE
        window.navigationBarColor = Color.WHITE
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setBackgroundColor(Color.WHITE) }
        val bar = LinearLayout(this).apply { gravity = Gravity.CENTER_VERTICAL; setPadding(18,12,18,12) }
        val brand = TextView(this).apply { text = "📕  Lite PDF Viewer"; textSize=20f; setTextColor(Color.rgb(30,30,35)); setTypeface(null,1) }
        bar.addView(brand, LinearLayout.LayoutParams(0,-2,1f))
        val open = Button(this).apply { text="Open PDF"; setTextColor(red); setOnClickListener { picker() } }
        bar.addView(open); root.addView(bar)
        title = TextView(this).apply { text=""; textSize=12f; setTextColor(Color.DKGRAY); setPadding(18,8,18,8) }
        root.addView(title)
        home = LinearLayout(this).apply { orientation=LinearLayout.VERTICAL; gravity=Gravity.CENTER; setPadding(28,30,28,30) }
        val hero = TextView(this).apply { text="📕"; textSize=76f; gravity=Gravity.CENTER }
        home.addView(hero)
        home.addView(TextView(this).apply { text="Your PDFs, beautifully simple."; textSize=22f; setTextColor(Color.rgb(30,30,35)); setTypeface(null,1); gravity=Gravity.CENTER; setPadding(0,16,0,8) })
        home.addView(TextView(this).apply { text="No clutter. No ads. Just open and read."; textSize=14f; setTextColor(Color.GRAY); gravity=Gravity.CENTER; setPadding(0,4,0,24) })
        home.addView(Button(this).apply { text="Open a PDF"; setOnClickListener { picker() } })
        root.addView(home, LinearLayout.LayoutParams(-1,0,1f))
        scroll = ScrollView(this).apply { visibility=View.GONE; setBackgroundColor(Color.rgb(240,241,244)) }
        pages = LinearLayout(this).apply { orientation=LinearLayout.VERTICAL; setPadding(10,10,10,10) }
        scroll.addView(pages); root.addView(scroll, LinearLayout.LayoutParams(-1,0,1f))
        setContentView(root)
        incoming(intent)
    }
    override fun onNewIntent(i: Intent) { super.onNewIntent(i); setIntent(i); incoming(i) }
    private fun incoming(i: Intent?) {
        val u = when(i?.action) { Intent.ACTION_VIEW -> i.data; Intent.ACTION_SEND -> { @Suppress("DEPRECATION") i.getParcelableExtra<Uri>(Intent.EXTRA_STREAM) }; else -> null }
        if(u!=null) showPdf(u)
    }
    private fun picker() {
        val i=Intent(Intent.ACTION_OPEN_DOCUMENT).apply { addCategory(Intent.CATEGORY_OPENABLE); type="application/pdf"; addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION) }
        startActivityForResult(i,7)
    }
    @Deprecated("Legacy callback")
    override fun onActivityResult(r:Int,c:Int,d:Intent?) { super.onActivityResult(r,c,d); if(r==7 && c==RESULT_OK) d?.data?.let { showPdf(it) } }
    private fun showPdf(uri:Uri) {
        try {
            closePdf()
            descriptor=contentResolver.openFileDescriptor(uri,"r") ?: throw IOException("Cannot open file")
            renderer=PdfRenderer(descriptor!!)
            pages.removeAllViews()
            val count=renderer!!.pageCount
            for(n in 0 until count) {
                val page=renderer!!.openPage(n)
                val width=(resources.displayMetrics.widthPixels-resources.displayMetrics.density*20).toInt()
                val scale=width.toFloat()/page.width
                val bmp=Bitmap.createBitmap(width,(page.height*scale).toInt(),Bitmap.Config.ARGB_8888)
                bmp.eraseColor(Color.WHITE); page.render(bmp,null,null,PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY); page.close()
                val image=ImageView(this).apply { setImageBitmap(bmp); adjustViewBounds=true; setBackgroundColor(Color.WHITE); elevation=3f }
                val lp=LinearLayout.LayoutParams(-1,-2); lp.bottomMargin=14; pages.addView(image,lp)
            }
            val name=contentResolver.query(uri,arrayOf(android.provider.OpenableColumns.DISPLAY_NAME),null,null,null)?.use { if(it.moveToFirst()) it.getString(0) else "PDF" } ?: "PDF"
            title.text="$name  •  $count pages"; home.visibility=View.GONE; scroll.visibility=View.VISIBLE
        } catch(e:Exception) { closePdf(); Toast.makeText(this,"Unable to open PDF: ${e.message}",Toast.LENGTH_LONG).show() }
    }
    private fun closePdf() { try { renderer?.close() } catch(_:Exception){}; try { descriptor?.close() } catch(_:Exception){}; renderer=null; descriptor=null }
    override fun onDestroy() { closePdf(); super.onDestroy() }
}