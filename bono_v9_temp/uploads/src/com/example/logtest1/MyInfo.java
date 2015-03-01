package com.example.logtest1;

import com.example.logtest1.Register.httpAsyncTask;
import com.example.logtest1.WebActivity.WebAppInterface;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MyInfo extends Activity {
    private WebView mainWebView;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
    	final Context context = this;
		super.onCreate(savedInstanceState);
        setContentView(R.layout.webcontent);
        mainWebView = (WebView) findViewById(R.id.webView);	
	    // TODO Auto-generated method stub
        mainWebView.addJavascriptInterface(new WebAppInterface(this), "Android"); 
        WebSettings webSettings = mainWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mainWebView.setWebChromeClient(new WebChromeClient() {});
        mainWebView.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/my_info.html");
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
        	if(toast.equals("ready"))
        	{
        		mainWebView.loadUrl("javascript:getFromAndroid('"+getPreferences("phone_num")+"::"+getPreferences("register_date")+"')");
        	}
        }
    }
	// 값 불러오기
	private String getPreferences(String arg) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		return pref.getString(arg, "");
	}

	// 값 저장하기
	private void savePreferences(String label, String data) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		SharedPreferences.Editor editor = pref.edit();
		editor.putString(label, data);
		editor.commit();
	}

	// 값(Key Data) 삭제하기
	private void removePreferences(String label) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		SharedPreferences.Editor editor = pref.edit();
		editor.remove(label);
		editor.commit();
	}

	// 값(ALL Data) 삭제하기
	private void removeAllPreferences() {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		SharedPreferences.Editor editor = pref.edit();
		editor.clear();
		editor.commit();
	}

}