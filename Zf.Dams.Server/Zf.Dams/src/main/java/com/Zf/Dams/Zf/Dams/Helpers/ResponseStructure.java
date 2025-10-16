package com.Zf.Dams.Zf.Dams.Helpers;

public class ResponseStructure<T>
{
	private Integer statusCode;
	
	private String message;
	
	private T data;

	public Integer getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(Integer statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
	
}
