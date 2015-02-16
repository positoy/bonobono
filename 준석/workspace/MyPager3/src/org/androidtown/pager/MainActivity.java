package org.androidtown.pager;

import java.util.ArrayList;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.Toast;

public class MainActivity extends FragmentActivity implements PageFragment.OnItemClickListener {
	ViewPager viewPager1;
	SingerPageApapter adapter;
	
	String[] names = {"소녀시대", "티아라", "포미닛", "걸스데이", "씨스타"};
	int[] images = {R.drawable.singer1, R.drawable.singer2, R.drawable.singer3, R.drawable.singer4, R.drawable.singer5};
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		viewPager1 = (ViewPager) findViewById(R.id.viewPager1);
		adapter = new SingerPageApapter(getSupportFragmentManager());

		adapter.addItem(PageFragment.newInstance(0, names[0], images[0]));
		adapter.addItem(PageFragment.newInstance(1, names[1], images[1]));
		adapter.addItem(PageFragment.newInstance(2, names[2], images[2]));
		adapter.addItem(PageFragment.newInstance(3, names[3], images[3]));
		adapter.addItem(PageFragment.newInstance(4, names[4], images[4]));
		
		viewPager1.setAdapter(adapter);
	}
	
	public void onButton1Clicked(View v) {
		viewPager1.setCurrentItem(0);
	}
	
	public void onButton2Clicked(View v) {
		viewPager1.setCurrentItem(1);
	}
	
	public void onButton3Clicked(View v) {
		viewPager1.setCurrentItem(2);
	}

	public void onButton4Clicked(View v) {
		viewPager1.setCurrentItem(3);
	}

	public void onButton5Clicked(View v) {
		viewPager1.setCurrentItem(4);
	}
	
	class SingerPageApapter extends FragmentStatePagerAdapter {
		ArrayList<Fragment> items = new ArrayList<Fragment>();
		
		public SingerPageApapter(FragmentManager fm) {
			super(fm);
		}

		@Override
		public Fragment getItem(int position) {
			return items.get(position);
		}

		public void addItem(Fragment item) {
			items.add(item);
		}
		
		@Override
		public int getCount() {
			return items.size();
		}

	}

	@Override
	public void onItemClick(int pageNumber, String data) {
		Toast.makeText(this, "페이지 #" + pageNumber + "(" + data + ") 의 버튼 클릭함.", Toast.LENGTH_LONG).show();
		
	}
	
}
