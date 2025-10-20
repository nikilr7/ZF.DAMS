package com.Zf.Dams.Zf.Dams.Dao;

import org.springframework.stereotype.Repository;

import com.Zf.Dams.Zf.Dams.Dao.SuperDao.SuperDao;
import com.Zf.Dams.Zf.Dams.Entities.Ticket;
import com.Zf.Dams.Zf.Dams.Repository.TicketRepository;

@Repository
public class TicketDao extends SuperDao<TicketRepository, Ticket, Integer> {

}
