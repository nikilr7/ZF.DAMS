package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Employee;
import com.Zf.Dams.Zf.Dams.Repository.employeeRepository;

@Repository
public class EmployeeDao extends SuperDao<employeeRepository, Employee, Integer>
{
	
}
