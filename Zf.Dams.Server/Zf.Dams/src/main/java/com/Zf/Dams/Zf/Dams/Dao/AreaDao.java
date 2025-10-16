package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.data.repository.CrudRepository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Area;
import com.Zf.Dams.Zf.Dams.Repository.AreaRepository;

public class AreaDao extends SuperDao<AreaRepository, Area, Integer>
{
	private final AreaRepository repos;

	public AreaDao(AreaRepository repos) {
		super(repos);
		this.repos = repos;
	}
	
}
