package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.AreaDao;
import com.Zf.Dams.Zf.Dams.Entities.Area;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;


@Service
public class AreaService 
{
	@Autowired
	private AreaDao dao;
	
	@Autowired
	Response<Area> response;
	
	public ResponseEntity<ResponseStructure<Area>> savedata(Area data)
	{
		Area save= dao.saveData(data);
		ResponseStructure<Area> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Area>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Area>>> findAllData()
	{
		Iterable<Area> list=dao.findAllData();
		ResponseStructure<Iterable<Area>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Area>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Area>> findById(Integer id)
	{
		Optional<Area> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Area> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Area>>(resp,HttpStatus.FOUND);
		}
		
		return null;
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Area> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		return null;
	}
	
	public ResponseEntity<ResponseStructure<Area>> UpdateData(Area data)
	{
		Optional<Area> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Area update= dao.saveData(data);
			
			ResponseStructure<Area> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Area>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
