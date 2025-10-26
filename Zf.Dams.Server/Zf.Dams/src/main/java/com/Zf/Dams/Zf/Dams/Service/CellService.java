package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.CellDao;
import com.Zf.Dams.Zf.Dams.Entities.Cell;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class CellService 
{
	@Autowired
	private CellDao dao;
	
	@Autowired
	Response<Cell> response;
	
	public ResponseEntity<ResponseStructure<Cell>> savedata(Cell data)
	{
		Cell save= dao.saveData(data);
		ResponseStructure<Cell> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Cell>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Cell>>> findAllData()
	{
		Iterable<Cell> list=dao.findAllData();
		ResponseStructure<Iterable<Cell>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Cell>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Cell>> findById(Integer id)
	{
		Optional<Cell> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Cell> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Cell>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Cell> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Cell>> UpdateData(Cell data)
	{
		Optional<Cell> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Cell update= dao.saveData(data);
			
			ResponseStructure<Cell> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Cell>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
