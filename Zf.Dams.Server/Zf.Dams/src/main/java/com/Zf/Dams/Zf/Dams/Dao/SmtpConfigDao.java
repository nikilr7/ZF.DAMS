package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.SmtpConfig;
import com.Zf.Dams.Zf.Dams.Repository.SmtpConfigRepository;

@Repository
public class SmtpConfigDao extends SuperDao<SmtpConfigRepository, SmtpConfig, Integer> {

}
