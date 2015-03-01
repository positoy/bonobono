package com.example.logtest1;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

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
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ParseException;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.method.KeyListener;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class Register extends Activity {
	private WebView mainWebView;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);

		setContentView(R.layout.webcontent);
		mainWebView = (WebView) findViewById(R.id.webView);
		// TODO Auto-generated method stub

		WebSettings webSettings = mainWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
//		mainWebView.clearCache(true);
		mainWebView
				.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/register.html");
		mainWebView
				.addJavascriptInterface(new WebAppInterface(this), "Android");

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
			if (toast.equals("getPhoneNum")) {
				if (getPreferences("phone_num") != null) {
					mainWebView.loadUrl("javascript:getFromAndroid('"
							+ getPreferences("phone_num") + "')");
				}
			} else {
				String[] temp = toast.split("/");
				final httpAsyncTask getAsyncTask = new httpAsyncTask();
				getAsyncTask.execute(temp);
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
	public class httpAsyncTask extends AsyncTask<String, Integer, JSONObject> {

		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}

		@Override
		protected JSONObject doInBackground(String... params) {
			Log.d("::doinback::", params[0] + " " + params[1] + " " + params[2]
					+ "" + params[3] + " " + getPreferences("device_id") + " "
					+ getPreferences("compNum"));
			JSONObject result = null;
			HttpClient client = new DefaultHttpClient();
			String postUrl = "http://54.65.213.112/appusers";
			HttpPost post = new HttpPost(postUrl);
			post.setHeader("Authorization", "Token "+getPreferences("apiToken"));
			try {
				ArrayList<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
				nameValuePairs
						.add(new BasicNameValuePair("first_come", "true"));
				nameValuePairs.add(new BasicNameValuePair("phone_num",
						params[1]));
				nameValuePairs.add(new BasicNameValuePair("device_id",
						getPreferences("device_id")));
				nameValuePairs.add(new BasicNameValuePair("company_num",
						getPreferences("compNum")));
				nameValuePairs
						.add(new BasicNameValuePair("address", params[0]));
				nameValuePairs.add(new BasicNameValuePair("lat", params[2]));
				nameValuePairs.add(new BasicNameValuePair("lng", params[3]));
				UrlEncodedFormEntity entityRequest = new UrlEncodedFormEntity(
						nameValuePairs, "UTF-8");

				post.setEntity(entityRequest);

				HttpResponse responsePost = client.execute(post);
				HttpEntity resEntity = responsePost.getEntity();

				String sRes = "";

				if (resEntity != null) {
					sRes = EntityUtils.toString(resEntity);

					Log.w("SNSApp", "response: " + sRes);
					JSONObject jsonObject = new JSONObject(sRes);
					result = jsonObject;
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
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			return result;
		}

		@Override
		protected void onPostExecute(JSONObject result) {
			super.onPostExecute(result);
			Log.d("::FUCK::", "2");

			if (result != null) {
				try {
					savePreferences("token", result.getString("token"));
					Log.d("::FUCK::", "token : " + getPreferences("token"));
					savePreferences("destination",
							result.getJSONArray("destination_list")
									.getJSONObject(0).getString("address"));
					savePreferences("destination_lat",
							result.getJSONArray("destination_list")
									.getJSONObject(0).getString("lat"));
					savePreferences("destination_lng",
							result.getJSONArray("destination_list")
									.getJSONObject(0).getString("lng"));
					savePreferences("destination_list",
							result.getJSONArray("destination_list").toString());
					savePreferences("register_date", new SimpleDateFormat(
							"yyyy-MM-dd").format(new Date()));

				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				Intent intent = new Intent(Register.this, WebActivity.class);
				startActivity(intent);
				finish();
			}

		}

		@Override
		protected void onCancelled() {
			super.onCancelled();
		}

	}
}
