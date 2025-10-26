package com.Zf.Dams.Zf.Dams.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Zf.Dams.Zf.Dams.Dao.CellDao;
import com.Zf.Dams.Zf.Dams.Dao.EmployeeDao;
import com.Zf.Dams.Zf.Dams.Entities.Cell;
import com.Zf.Dams.Zf.Dams.Entities.Employee;
import com.Zf.Dams.Zf.Dams.Helpers.Response;
import com.Zf.Dams.Zf.Dams.Helpers.ResponseStructure;
import com.Zf.Dams.Zf.Dams.Helpers.Exceptions.Id_Not_Found;


@Service
public class EmployeeService 
{
	@Autowired
	private EmployeeDao dao;
	
	@Autowired
	Response<Employee> response;
	
	public ResponseEntity<ResponseStructure<Employee>> savedata(Employee data)
	{
		Employee save= dao.saveData(data);
		ResponseStructure<Employee> resp=response.ResponseStructure(save, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Employee>>(resp,HttpStatus.CREATED);
	}
	
	public ResponseEntity<ResponseStructure<Iterable<Employee>>> findAllData()
	{
		Iterable<Employee> list=dao.findAllData();
		ResponseStructure<Iterable<Employee>> resp=response.ResponseStructureList(list, "Successful", HttpStatus.CREATED.value());
		
		return new ResponseEntity<ResponseStructure<Iterable<Employee>>>(resp,HttpStatus.CREATED);
		
	}
	
	public ResponseEntity<ResponseStructure<Employee>> findById(Integer id)
	{
		Optional<Employee> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			ResponseStructure<Employee> resp=response.ResponseStructure(opt.get(), "Found", HttpStatus.FOUND.value());
			
			return new ResponseEntity<ResponseStructure<Employee>>(resp,HttpStatus.FOUND);
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<String>> deleteData(Integer id)
	{
		Optional<Employee> opt=dao.findById(id);
		
		if(opt.isPresent())
		{
			String delete=dao.DeleteData(opt.get());
			
			ResponseStructure<String> resp=response.ResponseStructureDelete(delete, "Deleted", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<String>>(resp,HttpStatus.ACCEPTED);	
		}
		
		throw new Id_Not_Found();
	}
	
	public ResponseEntity<ResponseStructure<Employee>> UpdateData(Employee data)
	{
		Optional<Employee> opt=dao.findById(data.getId());
		
		if(opt.isPresent())
		{
			Employee update= dao.saveData(data);
			
			ResponseStructure<Employee> resp=response.ResponseStructure(update, "Updated", HttpStatus.ACCEPTED.value());
			
			return new ResponseEntity<ResponseStructure<Employee>>(resp,HttpStatus.ACCEPTED);
		}
		return null;
	}
}
