package org.androidtown.myapp;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.LinearLayout;
import android.widget.TextView;

public class SettingItemView extends LinearLayout {
	TextView textView1;
	TextView textView2;
	TextView textView3;
	
	public SettingItemView(Context context) {
		super(context);

		init(context);
	}
	
	public SettingItemView(Context context, AttributeSet attrs) {
		super(context, attrs);

		init(context);
	}

	private void init(Context context) {
		LayoutInflater inflater = (LayoutInflater) context.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
		inflater.inflate(R.layout.setting_item, this, true);
	
		textView1 = (TextView) findViewById(R.id.textView1);
		textView2 = (TextView) findViewById(R.id.textView2);
		textView3 = (TextView) findViewById(R.id.textView3);
	}
	
	public void setName(String name) {
		textView1.setText(name);
	}
	
	public void setAge(String age) {
		textView2.setText(age);
	}
	
	public void setAddress(String address) {
		textView3.setText(address);
	}
	
}








