package org.tacademy.fragment;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBarActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends ActionBarActivity {
	private static PlaceholderFragment fragment1;
	private static NewFragment fragment2;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		if (savedInstanceState == null) {
			fragment1 = new PlaceholderFragment();
			fragment2 = new NewFragment();
			
			getSupportFragmentManager().beginTransaction()
					.add(R.id.container, fragment1).commit();
		}
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

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class PlaceholderFragment extends Fragment {

		public PlaceholderFragment() {
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
			View rootView = inflater.inflate(R.layout.fragment_main, container, false);
			
			Button button1 = (Button) rootView.findViewById(R.id.button1);
			button1.setOnClickListener(new OnClickListener() {

				@Override
				public void onClick(View v) {
					Toast.makeText(getActivity(), "메인 프래그먼트의 버튼 클릭됨.", Toast.LENGTH_LONG).show();
					
					getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.container, fragment2).commit();
				}
				
			});
			
			
			return rootView;
		}
	}
	
	public static class NewFragment extends Fragment {
		
		public NewFragment() {
		}

		
		
		@Override
		public void onActivityCreated(Bundle savedInstanceState) {
			Toast.makeText(getActivity(), "onActivityCreated() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onActivityCreated(savedInstanceState);
		}



		@Override
		public void onAttach(Activity activity) {
			Toast.makeText(getActivity(), "onAttach() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onAttach(activity);
		}



		@Override
		public void onCreate(Bundle savedInstanceState) {
			Toast.makeText(getActivity(), "onCreate() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onCreate(savedInstanceState);
		}



		@Override
		public void onDestroy() {
			Toast.makeText(getActivity(), "onDestroy() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onDestroy();
		}



		@Override
		public void onDestroyView() {
			Toast.makeText(getActivity(), "onDestroyView() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onDestroyView();
		}



		@Override
		public void onDetach() {
			Toast.makeText(getActivity(), "onDetach() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onDetach();
		}



		@Override
		public void onPause() {
			Toast.makeText(getActivity(), "onPause() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onPause();
		}



		@Override
		public void onResume() {
			Toast.makeText(getActivity(), "onResume() 호출됨.", Toast.LENGTH_LONG).show();
			
			super.onResume();
		}



		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
			Toast.makeText(getActivity(), "onCreateView() 호출됨.", Toast.LENGTH_LONG).show();
			
			View rootView = inflater.inflate(R.layout.fragment_new, container, false);
			
			Button button1 = (Button) rootView.findViewById(R.id.button1);
			button1.setOnClickListener(new OnClickListener() {

				@Override
				public void onClick(View v) {
					Toast.makeText(getActivity(), "새로운 프래그먼트의 버튼 클릭됨.", Toast.LENGTH_LONG).show();
					
					getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.container, fragment1).commit();
				}
				
			});
			
			
			return rootView;
		}
		
	}
	
}
