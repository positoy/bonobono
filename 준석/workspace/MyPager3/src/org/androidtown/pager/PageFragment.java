package org.androidtown.pager;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class PageFragment extends Fragment {
	
	public interface OnItemClickListener {
		public void onItemClick(int pageNumber, String data);
	}
	
	OnItemClickListener listener;
	int pageNumber = 0;
	String name;
	int resId;
	
	public static PageFragment newInstance(int number, String name, int resId) {
		PageFragment fragment = new PageFragment();
		
		Bundle args = new Bundle();
		args.putInt("number", number);
		args.putString("name", name);
		args.putInt("resId", resId);
		
		fragment.setArguments(args);
		
		return fragment;
	}
	 
	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		
		if (activity instanceof OnItemClickListener) {
			listener = (OnItemClickListener) activity;
		} else {
			throw new ClassCastException(activity.toString() + "는 OnItemClickListener를 구현해야 합니다.");
		}
	}
 
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		Bundle bundle = getArguments();
		pageNumber = bundle.getInt("number");
		name = bundle.getString("name");
		resId = bundle.getInt("resId");
		
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		ViewGroup rootView = (ViewGroup) inflater.inflate(R.layout.fragment_page, container, false);
		
		TextView textView1 = (TextView) rootView.findViewById(R.id.textView1);
		textView1.setText("페이지 #" + pageNumber + " : " + name);
		
		Button button1 = (Button) rootView.findViewById(R.id.button1);
		button1.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				if (listener != null) {
					listener.onItemClick(pageNumber, name);
				}
			}
			
		});
		
		ImageView imageView1 = (ImageView) rootView.findViewById(R.id.imageView1);
		imageView1.setImageResource(resId);
		
		
		return rootView;
	}

}
