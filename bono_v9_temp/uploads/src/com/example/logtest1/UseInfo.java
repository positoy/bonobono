package com.example.logtest1;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;


import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.ParseException;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class UseInfo extends Activity {
    private WebView mainWebView;
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        setContentView(R.layout.webcontent);
        mainWebView = (WebView) findViewById(R.id.webView);	
	    // TODO Auto-generated method stub
        mainWebView.addJavascriptInterface(new WebAppInterface(this), "Android"); 
        WebSettings webSettings = mainWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mainWebView.setWebChromeClient(new WebChromeClient() {});
        mainWebView.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/use_info.html");
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
        		httpAsyncTask httpGet = new httpAsyncTask();
        		httpGet.execute();
        	}
        }
    }
	public class httpAsyncTask extends AsyncTask<String, Integer, String> {
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}

		@Override
		protected String doInBackground(String... params) {
			String result="";
			try {

				HttpClient client = new DefaultHttpClient();
				String url = "http://54.65.213.112/app/completes";
				HttpGet get = new HttpGet(url);
				get.addHeader("Authorization", "Token "
						+ getPreferences("token"));					
				HttpResponse response = null;
				response = client.execute(get);
				HttpEntity resEntity = response.getEntity();
				String sRes = "";
				if (resEntity != null) {
					sRes = EntityUtils.toString(resEntity);

					Log.w("SNSApp", "response: " + sRes);
					result = sRes;
				}
			} 
			catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return result;
		}

		@Override
		protected void onPostExecute(String result) {
			// TODO Auto-generated method stub
			super.onPostExecute(result);
			mainWebView.loadUrl("javascript:getFromAndroid('"+result+"')");
		}
	}
	
	// 값 불러오기
	private String getPreferences(String arg) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		return pref.getString(arg, "");
	}
}
