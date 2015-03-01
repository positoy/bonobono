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
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.logtest1.MainActivity.httpAsyncTask;

import android.app.Service;
import android.content.Intent;
import android.content.res.Resources;
import android.net.ParseException;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

public class PollingService extends Service {

	@Override
	public void onCreate() {
		Toast.makeText(this, "서비스 Oncreate", 1).show();
		super.onCreate();
	}

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Toast.makeText(this, "서비스 onStartCommand", 1).show();
		Runnable logoRunnable;
		Handler logoHandler;
        logoHandler = new Handler();
		logoRunnable = new Runnable() {
            @Override
            public void run() {
            	httpAsyncTask getAsyncTask = new httpAsyncTask();
            	getAsyncTask.execute("get");
            }
        };
        logoHandler.postDelayed(logoRunnable, 1500);
		return START_STICKY;
		// return super.onStartCommand(intent, flags, startId);
	}

	@Override
	public void onDestroy() {
		Log.d("slog", "onDestroy()");
		super.onDestroy();
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
				String url = "http://54.65.213.112/app/companies";
				HttpGet get = new HttpGet(url);
				HttpResponse response = null;
				response = client.execute(get);
				HttpEntity resEntity = response.getEntity();
				String sRes = "";
				if (resEntity != null) {
					sRes = EntityUtils.toString(resEntity);
	
					Log.w("SNSApp", "response: " + sRes);
	
				}
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return result;
		}

		@Override
		protected void onPostExecute(String result) {
			super.onPostExecute(result);
		}
	}
}
