package com.example.logtest1;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;





import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class DestinationMng extends Activity {
	private WebView mainWebView;

	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
		if(getPreferences("newHome").equals("y"))
		{
			mainWebView.loadUrl("javascript:getFromAndroid('"+getPreferences("destination_list")+"')");
			savePreferences("newHome","");
			savePreferences("destUpdate", "y");
		}		
	}
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		final Context context = this;
		super.onCreate(savedInstanceState);
		setContentView(R.layout.webcontent2);
		mainWebView = (WebView) findViewById(R.id.webView2);
		// TODO Auto-generated method stub
		mainWebView
				.addJavascriptInterface(new WebAppInterface(this), "Android");
		WebSettings webSettings = mainWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		mainWebView.setWebChromeClient(new WebChromeClient() {
		});
		mainWebView
				.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/destination_mng.html");
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
			String[] temp = toast.split("::");
			if (toast.equals("close")) {
				finish();
			} 
			else if (toast.equals("getlist")) {
				mainWebView.loadUrl("javascript:getFromAndroid('"
						+ getPreferences("destination_list") + "')");
			} 
			else if (temp[0].equals("deleteDestination")) {
				savePreferences("destUpdate", "y");
				httpAsyncTask httpDelete = new httpAsyncTask();
				httpDelete.execute(temp[2]);
			} 
			else if(temp[0].equals("updateDestination"))
			{
				Log.d("::FUCK::",temp[1]);
				savePreferences("destination_list", temp[1]);
			}
			else if(temp[0].equals("newHome"))
			{
				Intent intent = new Intent(mContext, NewHome.class);
				startActivity(intent);
			}
			else if(temp[0].equals("moveToHome"))
			{
				savePreferences("newDest",temp[1]);
				finish();
				
				
			}
		}
	}

	public class httpAsyncTask extends AsyncTask<String, Integer, Void> {

		@Override
		protected Void doInBackground(String... params) {
			HttpClient httpClient = new DefaultHttpClient();
			HttpDelete httpDelete = new HttpDelete(
					"http://54.65.213.112/destinations/" + params[0]);
			httpDelete.addHeader("Content-Type", "application/json");
			httpDelete.addHeader("Authorization", "Token "
					+ getPreferences("token"));
			HttpEntity responseEntity = null;

			HttpResponse response;
			try {
				response = httpClient.execute(httpDelete);

				StatusLine statusLine = response.getStatusLine();
				int statusCode = statusLine.getStatusCode();

				if (statusCode == 200) {
					responseEntity = response.getEntity();
					String result = EntityUtils.toString(responseEntity);
					Log.d("dh", result);
				} else {
					Log.d("dh", ""+statusCode);
				}
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;
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