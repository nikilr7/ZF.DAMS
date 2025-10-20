package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Log;
import com.Zf.Dams.Zf.Dams.Repository.LogRepository;

@Repository
public class LogDao extends SuperDao<LogRepository, Log, Integer> {

}
