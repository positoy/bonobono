package com.example.logtest1;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class LawInfo extends Activity {
    private WebView mainWebView;
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
    	final Context context = this;
		super.onCreate(savedInstanceState);
        setContentView(R.layout.webcontent2);
        mainWebView = (WebView) findViewById(R.id.webView2);	
	    // TODO Auto-generated method stub
        mainWebView.addJavascriptInterface(new WebAppInterface(this), "Android"); 
        WebSettings webSettings = mainWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mainWebView.setWebChromeClient(new WebChromeClient() {});
        mainWebView.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/law_info.html");
	}

    public class WebAppInterface {
        Context mContext;

        /** Instantiate the interface and set the context */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void getFromJS(String toast) {
        	if(toast.equals("close"))
        	{
        		finish();
        	}
        }
    }
}

