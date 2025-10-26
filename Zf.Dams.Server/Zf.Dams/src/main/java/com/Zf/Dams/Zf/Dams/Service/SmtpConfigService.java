package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.MachineDao;
import com.Zf.Dams.Zf.Dams.Dao.RevisionDao;
import com.Zf.Dams.Zf.Dams.Dao.SmtpConfigDao;
import com.Zf.Dams.Zf.Dams.Entities.Machine;
import com.Zf.Dams.Zf.Dams.Entities.Revision;
import com.Zf.Dams.Zf.Dams.Entities.SmtpConfig;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class SmtpConfigService 
{
	@Autowired
	private SmtpConfigDao dao;
	
	@Autowired
	Response<SmtpConfig> response;
	
	public ResponseEntity<ResponseStructure<SmtpConfig>> savedata(SmtpConfig data)
	{
		SmtpConfig save= dao.saveData(data);
		ResponseStructure<SmtpConfig> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<SmtpConfig>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<SmtpConfig>>> findAllData()
	{
		Iterable<SmtpConfig> list=dao.findAllData();
		ResponseStructure<Iterable<SmtpConfig>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<SmtpConfig>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<SmtpConfig>> findById(Integer id)
	{
		Optional<SmtpConfig> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<SmtpConfig> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<SmtpConfig>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<SmtpConfig> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<SmtpConfig>> UpdateData(SmtpConfig data)
	{
		Optional<SmtpConfig> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			SmtpConfig update= dao.saveData(data);
			
			ResponseStructure<SmtpConfig> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<SmtpConfig>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
