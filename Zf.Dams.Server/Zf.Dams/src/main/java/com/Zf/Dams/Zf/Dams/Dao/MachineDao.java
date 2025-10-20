package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Machine;
import com.Zf.Dams.Zf.Dams.Repository.MachineRepository;

@Repository
public class MachineDao extends SuperDao<MachineRepository, Machine, Integer>
{
	
}
