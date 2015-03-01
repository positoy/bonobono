package com.example.logtest1;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;


import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.ParseException;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class DestSearch extends Activity {
	private WebView mainWebView;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.webcontent2);
		mainWebView = (WebView) findViewById(R.id.webView2);
		// TODO Auto-generated method stub

		WebSettings webSettings = mainWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);		
		mainWebView.requestFocus();

		mainWebView.setWebChromeClient(new WebChromeClient() {
		});
		mainWebView
				.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/dest_search.html");
		mainWebView
				.addJavascriptInterface(new WebAppInterface(this), "Android");
	}

	public class WebAppInterface {
		/** Instantiate the interface and set the context */
		WebAppInterface(Context c) {
		}

		/** Show a toast from the web page */
		@JavascriptInterface
		public void getFromJS(String toast) {
			if(toast.equals("exit"))
			{
				finish();
			}
			else
			{
				httpAsyncTask postMessage = new httpAsyncTask();
				postMessage.execute(toast);
			}
		}
	}
	@Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK && event.isTracking()
				&& !event.isCanceled()) {
			return true;
		}
		Log.d("::FUCK::","키코드!!! "+String.valueOf(keyCode));
		return super.onKeyUp(keyCode, event);
	}
	public class httpAsyncTask extends AsyncTask<String, Integer, Void> {
		
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}
		@Override
		protected Void doInBackground(String... params) {
			String[] temp = params[0].split("/");
			savePreferences("newDest", temp[0]);
			savePreferences("newLat", temp[1]);
			savePreferences("newLng", temp[2]);
			HttpClient client = new DefaultHttpClient();
			String postUrl = "http://54.65.213.112/destinations";
			HttpPost post = new HttpPost(postUrl);
			try {
				ArrayList<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
				nameValuePairs
						.add(new BasicNameValuePair("address", temp[0]));
				nameValuePairs
					.add(new BasicNameValuePair("home", "false"));
				nameValuePairs
					.add(new BasicNameValuePair("lat", temp[1]));
				nameValuePairs
					.add(new BasicNameValuePair("lng", temp[2]));

				UrlEncodedFormEntity entityRequest = new UrlEncodedFormEntity(
						nameValuePairs, "UTF-8");

				post.setHeader("Authorization", "Token "+getPreferences("token"));
				post.setEntity(entityRequest);

				HttpResponse responsePost = client.execute(post);
				HttpEntity resEntity = responsePost.getEntity();

				String sRes = "";

				if (resEntity != null) {
					sRes = EntityUtils.toString(resEntity);

					Log.w("SNSApp", "response: " + sRes);					
					savePreferences("destination_list", sRes);
				}
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			return null;
		}
		@Override
		protected void onPostExecute(Void result) {
			// TODO Auto-generated method stub
			super.onPostExecute(result);
			finish();
		}
	}
	// 값 저장하기
	private void savePreferences(String label, String data) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		SharedPreferences.Editor editor = pref.edit();
		editor.putString(label, data);
		editor.commit();
	}
	private String getPreferences(String arg) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		return pref.getString(arg, "");
	}	
}
