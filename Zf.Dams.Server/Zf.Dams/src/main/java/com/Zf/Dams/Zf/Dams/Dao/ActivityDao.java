package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Repository.ActivityRepository;

public class ActivityDao extends SuperDao<CrudRepository<ActivityRepository,Integer>, ActivityRepository, Integer>
{
	@Autowired
	private ActivityRepository repos;
	
	public ActivityDao(CrudRepository<ActivityRepository, Integer> repos) {
		super(repos);
		
	}
}
