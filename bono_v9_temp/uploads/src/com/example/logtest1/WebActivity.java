package com.example.logtest1;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ParseException;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Gravity;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebSettings.RenderPriority;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import android.widget.TextView;

public class WebActivity extends Activity {
	private WebView mainWebView;
	double lat;
	double lng;
	Context context; 
	boolean traceFlag=false;
	int backFlag = 0;
	LocationManager webViewLocationManager = null;
	private LocationListener webViewLocationListener;
	Intent intent;
	// 위치정보 장치 이름
	String provider = null;
	
	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
		if (!getPreferences("newDest").equals("")) {
			mainWebView.loadUrl("javascript:getFromAndroid('newDest::"
					+ getPreferences("newDest") + "/"+ getPreferences("newLat") + "/"+ getPreferences("newLng") + "/"+getPreferences("destination_list")+"')");
			savePreferences("newDest", "");
		}
		if (!getPreferences("destUpdate").equals("")) {
			mainWebView.loadUrl("javascript:getFromAndroid('updateDest::"+getPreferences("destination_list")+"')");
			savePreferences("destUpdate", "");
		}
	}

	public void onCreate(Bundle savedInstanceState) {
		intent = getIntent();
		final Context context = this;
		super.onCreate(savedInstanceState);
		setContentView(R.layout.webcontent);
		webViewLocationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		webViewLocationListener = new LocationListener() {

			@Override
			public void onLocationChanged(Location location) {
				// TODO Auto-generated method stub
				lat = location.getLatitude();
				lng = location.getLongitude();
				mainWebView.loadUrl("javascript:getFromAndroid('coords::" + lat
						+ "/" + lng + "')");
			}

			@Override
			public void onStatusChanged(String provider, int status,
					Bundle extras) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onProviderEnabled(String provider) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onProviderDisabled(String provider) {
				// TODO Auto-generated method stub

			}
		};
		mainWebView = (WebView) findViewById(R.id.webView);
		mainWebView.clearCache(true);
		mainWebView
				.addJavascriptInterface(new WebAppInterface(this), "Android");
		WebSettings webSettings = mainWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setGeolocationEnabled(true);
		mainWebView.getSettings().setRenderPriority(RenderPriority.HIGH);
		mainWebView.setWebChromeClient(new WebChromeClient() {
			public void onGeolocationPermissionsShowPrompt(String origin,
					GeolocationPermissions.Callback callback) {
				callback.invoke(origin, true, false);
			}
		});
		mainWebView
				.loadUrl("http://webauthoring.ajou.ac.kr/~krown/u2/index.html");
	}

	private void call() {
		try {
			Intent callIntent = new Intent(Intent.ACTION_DIAL);
			callIntent.setData(Uri.parse("tel:" + getPreferences("compNum")));
			startActivity(callIntent);
		} catch (ActivityNotFoundException e) {
			Log.e("helloandroid dialing example", "Call failed", e);
		}
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
			String[] temp = toast.split("~~");
			if (temp[0].equals("order")) {
				httpAsyncTask post = new httpAsyncTask();
				post.execute(temp[1]);
			} else if (temp[0].equals("call")) {
				call();
			} else if (temp[0].equals("getInitInfo")) {
				String startTime = "0";
				backFlag = 1;
				Log.d("::FUCK::","order_code... "+getPreferences("order_code"));
				if(!getPreferences("order_code").equals("")){
					Log.d("::FUCK::","in order_code compare... "+getPreferences("order_code"));
					Long beforeTime =Long.parseLong(getPreferences("destroy_time"));
					Long thisTime = System.currentTimeMillis();
					Log.d("::FUCK::","bf "+beforeTime+" ts "+thisTime);
					if(thisTime-beforeTime>Long.parseLong(getPreferences("cancel_time"))*1000)
					{
						removePreferences("order_code");
						removePreferences("cancel_time");
					}
					else
					{
						startTime = String.valueOf(Integer.parseInt(getPreferences("cancel_time"))-(int)((thisTime-beforeTime)/1000));
					}
				}
				mainWebView.loadUrl("javascript:getFromAndroid('init::"
						+ getPreferences("destination") + "/"
						+ getPreferences("compNum") + "/"
						+ getPreferences("token") + "/"
						+ getPreferences("destination_list")+"/"
						+ getPreferences("destination_lat") + "/"
						+ getPreferences("destination_lng") + "/"
						+ getPreferences("compName") + "/"
						+ getPreferences("my_lat")+ "/"
						+ getPreferences("my_lng") + "/"
						+ startTime + "/"
						+ getPreferences("order_code")+"')");
			} else if (temp[0].equals("dest_search")) {
				Intent intent = new Intent(mContext, DestSearch.class);
				startActivity(intent);
			} else if(temp[0].equals("my_info")) {
				Log.d("::FUCK::",",mi-1");
				Intent intent = new Intent(mContext, MyInfo.class);
				Log.d("::FUCK::",",mi0");
				startActivity(intent);
			}else if (temp[0].equals("use_info")) {
				Intent intent = new Intent(mContext, UseInfo.class);
				startActivity(intent);
			}else if (temp[0].equals("law_info")) {
				Intent intent = new Intent(mContext, LawInfo.class);
				startActivity(intent);
			}else if (temp[0].equals("destination_mng")) {
				Intent intent = new Intent(mContext, DestinationMng.class);
				startActivity(intent);
			}else if(temp[0].equals("trace_loc")){
				Log.d("::FUCK::", "trace");
				webViewLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 500, 3, webViewLocationListener);
			}else if(temp[0].equals("stop_trace_loc")){
				Log.d("::FUCK::", "stop_trace");
				webViewLocationManager.removeUpdates(webViewLocationListener);
			}else if(temp[0].equals("canClose")){
				backFlag=2;
				finish();
			}else if(temp[0].equals("alert")){	
				makeAlert(temp[1],temp[2]);
			}else if(temp[0].equals("cancel_time")){
				savePreferences("cancel_time", temp[1]);
			}else if(temp[0].equals("cancel_time_out")){	
				removePreferences("order_code");
			}else if(temp[0].equals("order_cancel")){	
				delHttpAsyncTask del = new delHttpAsyncTask();
				del.execute();
			}
		}
	}

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
	
	private void removePreferences(String label) {
		SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
		SharedPreferences.Editor editor = pref.edit();
		editor.remove(label);
		editor.commit();
	}
	
	
	public class delHttpAsyncTask extends AsyncTask<String, Integer, Integer> {
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}

		@Override
		protected Integer doInBackground(String... params) {
			int result = 0;
			try {
					HttpClient client = new DefaultHttpClient();
					String url = "http://54.65.213.112/app/orders/"+getPreferences("order_code");
					HttpDelete del = new HttpDelete(url);
					del.setHeader("Authorization", "Token "+getPreferences("apiToken"));
					HttpResponse response = null;
					response = client.execute(del);
					HttpEntity resEntity = response.getEntity();
					result = response.getStatusLine().getStatusCode();
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
			return result;
		}

		@Override
		protected void onPostExecute(Integer result) {
			// TODO Auto-generated method stub
			super.onPostExecute(result);
			if(result.equals(205))
			{
				makeAlert("취소 결과","\n주문 취소 되었습니다.\n");
				mainWebView.loadUrl("javascript:getFromAndroid('cancel_status::205')");
			}
			else{
				makeAlert("취소 결과","\n주문 취소에 실패하였습니다.\n");
				mainWebView.loadUrl("javascript:getFromAndroid('cancel_status::400')");
			}
		}
	}	
	
	
	
	public class httpAsyncTask extends AsyncTask<String, Integer, Integer> {
		int result=0;
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}
		@Override
		protected Integer doInBackground(String... params) {
			String[] temp = params[0].split("/");
			HttpClient client = new DefaultHttpClient();
			String postUrl = "http://54.65.213.112/app/orders";
			HttpPost post = new HttpPost(postUrl);
			try {
				ArrayList<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
				nameValuePairs
						.add(new BasicNameValuePair("destination", temp[0]+"("+temp[5]+","+temp[6]+")"));
				nameValuePairs
						.add(new BasicNameValuePair("source", temp[1]+"("+temp[7]+","+temp[8]+")"));
				nameValuePairs
						.add(new BasicNameValuePair("via", temp[2]));
				nameValuePairs
				.add(new BasicNameValuePair("auto", temp[3]));
				nameValuePairs
						.add(new BasicNameValuePair("price", temp[4]));
				UrlEncodedFormEntity entityRequest = new UrlEncodedFormEntity(
						nameValuePairs, "UTF-8");
				post.setHeader("Authorization", "Token "+getPreferences("token"));
				post.setEntity(entityRequest);

				HttpResponse responsePost = client.execute(post);
				HttpEntity resEntity = responsePost.getEntity();
				int status_code = responsePost.getStatusLine().getStatusCode();

				String sRes = "";
				if (status_code == 201) {
					sRes = EntityUtils.toString(resEntity);
//					savePreferences("order_code",sRes);
					savePreferences("order_code","22");
					Log.w("SNSApp", "response: " + sRes);										
				}
				result = status_code;
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
			return result;
		}
		@Override
		protected void onPostExecute(Integer result) {
			// TODO Auto-generated method stub
			super.onPostExecute(result);
			Log.d("::FUCK::",result.toString());
			if(result.equals(201))
			{
				makeAlert("주문 결과","\n주문이 접수 되었습니다.\n");
				mainWebView.loadUrl("javascript:getFromAndroid('order::y::"+getPreferences("order_code")+"')");
			}
			else{
				makeAlert("주문 결과","\n주문 접수에 실패하였습니다.\n");
				mainWebView.loadUrl("javascript:getFromAndroid('order::n')");
			}
		}
	}
	
	public void makeAlert(String title,String message){
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle(title);
		builder.setMessage(message);
		builder.setPositiveButton("확인", null);
		AlertDialog dialog = builder.show();
		TextView messageText = (TextView)dialog.findViewById(android.R.id.message);
		messageText.setGravity(Gravity.CENTER);
		dialog.show();
	}
	@Override
	protected void onDestroy() {
		// TODO Auto-generated method stub
		Log.d("::FUCK::",Long.toString(System.currentTimeMillis()));
		savePreferences("destroy_time",Long.toString(System.currentTimeMillis()));
		super.onDestroy();
	}
	@Override
	public void onBackPressed() {
	    if(backFlag==1){
			mainWebView.loadUrl("javascript:getFromAndroid('back')");
	    }
	    else if(backFlag==2){
	    	backFlag = 1;
	    	super.onBackPressed();
	    }
	}
}