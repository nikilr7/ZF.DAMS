package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Activity;
import com.Zf.Dams.Zf.Dams.Repository.ActivityRepository;

@Repository
public class ActivityDao extends SuperDao<ActivityRepository, Activity, Integer> 
{
	
}
