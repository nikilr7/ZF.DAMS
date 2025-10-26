package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.TicketDao;
import com.Zf.Dams.Zf.Dams.Entities.Ticket;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class TiceketService 
{
	@Autowired
	private TicketDao dao;
	
	@Autowired
	Response<Ticket> response;
	
	public ResponseEntity<ResponseStructure<Ticket>> savedata(Ticket data)
	{
		Ticket save= dao.saveData(data);
		ResponseStructure<Ticket> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Ticket>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Ticket>>> findAllData()
	{
		Iterable<Ticket> list=dao.findAllData();
		ResponseStructure<Iterable<Ticket>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Ticket>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Ticket>> findById(Integer id)
	{
		Optional<Ticket> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Ticket> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Ticket>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Ticket> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Ticket>> UpdateData(Ticket data)
	{
		Optional<Ticket> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Ticket update= dao.saveData(data);
			
			ResponseStructure<Ticket> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Ticket>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
