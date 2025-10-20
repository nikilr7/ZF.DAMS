package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Family;
import com.Zf.Dams.Zf.Dams.Repository.FamilyRepository;

@Repository
public class FamilyDao extends SuperDao<FamilyRepository, Family, Integer>
{
	
}
