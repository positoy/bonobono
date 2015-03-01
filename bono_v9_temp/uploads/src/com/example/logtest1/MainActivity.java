package com.example.logtest1;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ContentResolver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.database.Cursor;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.ParseException;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.CallLog;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

@SuppressLint("HandlerLeak")
public class MainActivity extends Activity {
	String lat;
	String lng;
	boolean flag = true;
	boolean t_flag = false;
	private Runnable locRunnable;
	private Handler locHandler;
	// 위치정보 객체
	LocationManager mainLocationManager = null;
	private LocationListener mainLocationListener;

	private Handler m_objHandler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch (msg.what) {
			case 1: {
				TextView text2 = (TextView) findViewById(R.id.textView2);
				Resources res = getResources();
            	String logData = "위치 정보 불러 오는 중...";
            	String log = String.format(res.getString(R.string.splash_text2), logData);
        		text2.setText(log);
				locRunnable = new Runnable() {
		            @Override
		            public void run() {
						savePreferences("my_lat",String.valueOf(37.4987));
						savePreferences("my_lng",String.valueOf(127.0275));
						changeActivity();
		            }
		        };
		        locHandler = new Handler();
		        locHandler.postDelayed(locRunnable, 10000);

		        mainLocationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
				mainLocationListener = new LocationListener() {

					@Override
					public void onLocationChanged(Location location) {
						// TODO Auto-generated method stub
						double lat = location.getLatitude();
						double lng = location.getLongitude();
						savePreferences("my_lat",String.valueOf(lat));
						savePreferences("my_lng",String.valueOf(lng));
					   	mainLocationManager.removeUpdates(mainLocationListener);
						changeActivity();
					}
					@Override public void onStatusChanged(String provider, int status,Bundle extras) {}
					@Override public void onProviderEnabled(String provider) {}
					@Override public void onProviderDisabled(String provider) {}
				};
				mainLocationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 100, 3, mainLocationListener);
				break;
			}
			case 2: {
				if (flag) {
					alertCheckGPS();
				}
				flag = false;
				openThreadCheckUp();
				break;
			}
			}
		}
	};

	void changeActivity(){
		locHandler.removeCallbacksAndMessages(null);		
		if (t_flag) {
			Intent intent = new Intent(MainActivity.this,
					WebActivity.class);
			startActivity(intent);
			finish();
		} else {
			Intent intent = new Intent(MainActivity.this,
					Register.class);
			startActivity(intent);
			finish();
		}
	}
	private void alertNetwork() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setMessage("인터넷 연결에 실패했습니다.\n네트워크 연결을 확인하세요")
				.setCancelable(false)
				.setPositiveButton("앱종료",
						new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								android.os.Process
										.killProcess(android.os.Process.myPid());
								System.exit(1);
							}
						});
		AlertDialog alert = builder.create();
		alert.show();
	}

	private void alertCheckGPS() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setMessage("GPS 장치가 꺼져있습니다. 켜시겠습니까?")
				.setCancelable(false)
				.setPositiveButton("GPS 켜기",
						new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								moveConfigGPS();
							}
						})
				.setNegativeButton("그만둔다",
						new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								flag = true;
								dialog.cancel();
								android.os.Process
										.killProcess(android.os.Process.myPid());
								System.exit(1);
							}
						});
		AlertDialog alert = builder.create();
		alert.show();
	}

	private void moveConfigGPS() {
		Intent gpsOptionsIntent = new Intent(
				android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
		gpsOptionsIntent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
		startActivity(gpsOptionsIntent);
	}

	private void openThreadCheckUp() {
		Thread thread = new Thread() {
			@Override
			public void run() {
				try {
					boolean bResult = checkGPS();
					if (true == bResult) {
						m_objHandler.sendEmptyMessage(1);
					} else {
						m_objHandler.sendEmptyMessage(2);
						// m_objHandler.sendEmptyMessageDelayed(2, 2000);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		};
		thread.start();
	}

	public boolean checkGPS() {
		boolean bResult = false;

		String gps = android.provider.Settings.Secure.getString(
				this.getContentResolver(),
				android.provider.Settings.Secure.LOCATION_PROVIDERS_ALLOWED);

		if (!(gps.matches(".*gps.*") && gps.matches(".*network.*"))) {
			// GPS OFF 일때
			bResult = false;
		} else {
			bResult = true;
		}

		return bResult;
	}

	// 위치정보 장치 이름

	public void checkCompName() {
		TextView compName = (TextView) findViewById(R.id.textView4);
		TextView text1 = (TextView) findViewById(R.id.textView1);
		TextView text2 = (TextView) findViewById(R.id.textView2);

		if (getPreferences("token") == "") {
			Resources res = getResources();
			String compNameString = String.format(res.getString(R.string.splash_text1),"");
			String log = String.format(res.getString(R.string.splash_text2),"계약 업체 확인 중...");
			text1.setText("대리GO!");
			text1.setTextSize(42);
			compName.setText(compNameString);			
			text2.setText(log);
			final httpAsyncTask getAsyncTask = new httpAsyncTask();
			getAsyncTask.execute("get");
		} else {

			t_flag = true;
			String logonames = getPreferences("compNum").substring(0, 4)+"-"+getPreferences("compNum").substring(4, 8);
			String logData = "회원 정보 확인 중...";
			Resources res = getResources();
			String log = String.format(res.getString(R.string.splash_text2),
					logData);
			String compNameString = String.format(res.getString(R.string.splash_text1),getPreferences("compName"));
			text1.setText(logonames);
			compName.setText(compNameString);			
			text2.setText(log);
			// 로그인 데이터 가져오기
			final httpAsyncTask postAsyncTask = new httpAsyncTask();
			postAsyncTask.execute("post");
		}
	}

	public void getRecentNum(JSONArray result,JSONArray recomComp) throws JSONException {
		String address = "";
		String query = "";
		for (int i = 0; i < result.length(); i++) {
			query += (CallLog.Calls.NUMBER+"="+ result.getJSONObject(i).getString("phone_num"));
			if (i == result.length() - 1) {
				break;
			}
			query += " or ";
		}
		ContentResolver cr = getContentResolver();

		try{
			Cursor c = cr.query(CallLog.Calls.CONTENT_URI, new String[] {CallLog.Calls.NUMBER},
					query, null, "date DESC");
			int number = c.getColumnIndex(CallLog.Calls.NUMBER);
			if (c.getCount() != 0) {
				c.moveToFirst();
				address = c.getString(number);
			}
			if (address.equals("")) {
				Log.d("::FUCK::", "recom.... "+recomComp.getJSONObject(0).getString("phone_num")+" "+recomComp.getJSONObject(0).getString("company_name"));
				savePreferences("compNum", recomComp.getJSONObject(0).getString("phone_num"));
				savePreferences("compName",recomComp.getJSONObject(0).getString("company_name"));
			} else{
				Log.d("::address::", address);
				savePreferences("compNum", address);
				for (int i = 0; i < result.length(); i++) {
					if(result.getJSONObject(i).getString("phone_num").equals(address))
					{
						savePreferences("compName",result.getJSONObject(i).getString("company_name"));
						break;
					}
				}
			}
		}catch(NullPointerException e){
			savePreferences("compNum", recomComp.getJSONObject(0).getString("phone_num"));
			savePreferences("compName",recomComp.getJSONObject(0).getString("company_name"));
		}		
	}

	public void startCheckUp() {
		final TextView text2 = (TextView) findViewById(R.id.textView2);
		final Resources res = getResources();
		Runnable logoRunnableA;
		final Runnable logoRunnableB;
		final Handler logoHandler;
        logoHandler = new Handler();
		logoRunnableB = new Runnable() {
            @Override
            public void run() {
        		String logData = "GPS 설정 check 중...";
        		String log = String.format(res.getString(R.string.splash_text2), logData);
        		text2.setText(log);
        		openThreadCheckUp();
            }
        };
		logoRunnableA = new Runnable() {
            @Override
            public void run() {
            	String logData = "토큰 받아 오는 중...";
            	String log = String.format(res.getString(R.string.splash_text2), logData);
        		text2.setText(log);
                logoHandler.postDelayed(logoRunnableB, 500);		
            }
        };
        logoHandler.postDelayed(logoRunnableA, 500);				
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

	public boolean isNetworkOnline() {
		boolean status = false;
		try {
			ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo netInfo = cm.getNetworkInfo(0);
			if (netInfo != null
					&& netInfo.getState() == NetworkInfo.State.CONNECTED) {
				status = true;
			} else {
				netInfo = cm.getNetworkInfo(1);
				if (netInfo != null
						&& netInfo.getState() == NetworkInfo.State.CONNECTED)
					status = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return status;
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

	public class httpAsyncTask extends AsyncTask<String, Integer, Void> {
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}

		@Override
		protected Void doInBackground(String... params) {
			try {
				if (params[0].equals("get")) {// 회원가입위함
					Log.d("::doinback::", params[0]);
					JSONArray result = null;

					HttpClient client = new DefaultHttpClient();
					String url = "http://54.65.213.112/app/companies";
					HttpGet get = new HttpGet(url);
					get.setHeader("Authorization", "Token "+getPreferences("apiToken"));
					HttpResponse response = null;
					response = client.execute(get);
					HttpEntity resEntity = response.getEntity();
					String sRes = "";
					if (resEntity != null) {
						sRes = EntityUtils.toString(resEntity);

						Log.w("SNSApp", "response: " + sRes);

						JSONObject jsonObject = new JSONObject(sRes);
						result = jsonObject.getJSONArray("company");
						getRecentNum(result,jsonObject.getJSONArray("primary"));
					}
				} else {// 로그인
					Log.d("SNSApp", "ready to get Token : "
							+ getPreferences("phone_num") + " "
							+ getPreferences("device_id") + " "
							+ getPreferences("compNum"));
					JSONObject result = null;
					HttpClient client = new DefaultHttpClient();
					String postUrl = "http://54.65.213.112/appusers";
					HttpPost post = new HttpPost(postUrl);
					post.setHeader("Authorization", "Token "+getPreferences("apiToken"));
					ArrayList<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
					nameValuePairs.add(new BasicNameValuePair("first_come",
							"false"));
					nameValuePairs.add(new BasicNameValuePair("phone_num",
							getPreferences("phone_num")));
					nameValuePairs.add(new BasicNameValuePair("device_id",
							getPreferences("device_id")));
					nameValuePairs.add(new BasicNameValuePair("company_num",
							getPreferences("compNum")));
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
						savePreferences("token", result.getString("token"));
						savePreferences("destination_list", result
								.getJSONArray("destination_list").toString());
						Log.d("SNSApp",
								"get Login token : "
										+ result.getString("token"));
						Log.d("SNSApp", "get destination : "
								+ result.getJSONArray("destination_list")
										.toString());
					}
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
			return null;
		}

		@Override
		protected void onPostExecute(Void result) {
			// TODO Auto-generated method stub
			super.onPostExecute(result);
			startCheckUp();
		}
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//removeAllPreferences();
		savePreferences("apiToken", "4e0e62db93ddcad62c49549c26aafd0155a72029");
		String phoneNum = "01000000000";
		try{
			TelephonyManager tMgr = (TelephonyManager) this
					.getSystemService(Context.TELEPHONY_SERVICE);
			phoneNum = tMgr.getLine1Number();
		}
		catch(NullPointerException e)
		{
			phoneNum="01000000000";
		}
		
		if (phoneNum.charAt(0) == '+') {
			String temp = phoneNum.replace("+82", "0");
			phoneNum = temp;
		}
		savePreferences("phone_num", phoneNum);
		savePreferences(
				"device_id",
				""
						+ android.provider.Settings.Secure.getString(
								getContentResolver(),
								android.provider.Settings.Secure.ANDROID_ID));
		if (!isNetworkOnline()) {
			alertNetwork();
		} else {
			setContentView(R.layout.webcontent3);
			checkCompName();

		}
	}
	@Override
	protected void onDestroy() {
		// TODO Auto-generated method stub
		try{
			locHandler.removeCallbacksAndMessages(null);
		}
		catch(NullPointerException e)
		{
			
		}
		super.onDestroy();
	}

}
