package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.Zf.Dams.Zf.Dams.Dao.AreaDao;
import com.Zf.Dams.Zf.Dams.Entities.Area;

public class AreaService 
{
	@Autowired
	private AreaDao dao;
	
	public Area saveActivity(Area data)
	{
		return dao.saveData(data);
	}
	
	public Iterable<Area> findAllActivity()
	{
		return dao.findAllData();
	}
	
	public Optional<Area> findActivityById(Integer id)
	{
		return dao.findById(id);
	}
	
	public String DeletingActivity(Area data)
	{
		return dao.DeleteData(data);
	}
}
