package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Revision;
import com.Zf.Dams.Zf.Dams.Repository.RevisionRepository;

@Repository
public class RevisionDao extends SuperDao<RevisionRepository, Revision, Integer> {

}
