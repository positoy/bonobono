package org.tacademy.pager;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
	ViewPager pager1;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		pager1 = (ViewPager) findViewById(R.id.pager1);
		MyApapter adapter = new MyApapter();
		pager1.setAdapter(adapter);
		
	}
	
	class MyApapter extends PagerAdapter {
		String[] names = {"¼Ò³à½Ã´ë", "Æ¼¾Æ¶ó", "Æ÷¹Ì´Ö"};
		
		@Override
		public int getCount() {
			return names.length;
		}

		@Override
		public boolean isViewFromObject(View view, Object obj) {
			return view.equals(obj);
		}

		@Override
		public void destroyItem(View container, int position, Object object) {
			pager1.removeView((View) object);
		}

		@Override
		public Object instantiateItem(View container, int position) {
			
			LinearLayout layout = new LinearLayout(getApplicationContext());
			layout.setOrientation(LinearLayout.VERTICAL);
			
			TextView view = new TextView(getApplicationContext());
			view.setText(names[position]);
			view.setTextSize(40.0f);
			view.setTextColor(Color.BLUE);
			
			layout.addView(view);
			
			pager1.addView(layout, position);
			
			return layout;
		}
		
		
		
	}
	
}
