package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.ActivityDao;
import com.Zf.Dams.Zf.Dams.Entities.Activity;


@Service
public class ActivityService 
{
	@Autowired
	private ActivityDao dao;
	
	public Activity saveActivity(Activity data)
	{
		return dao.saveData(data);
	}
	
	public Iterable<Activity> findAllActivity()
	{
		return dao.findAllData();
	}
	
	public Optional<Activity> findActivityById(Integer id)
	{
		return dao.findById(id);
	}
	
	public String DeletingActivity(Activity data)
	{
		return dao.DeleteData(data);
	}
}
