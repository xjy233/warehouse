package com.example.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;

public class LogOut extends HttpServlet{
	
	@RequestMapping("/logout")
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//请求重定向
		response.sendRedirect("./");
		HttpSession session = request.getSession();
		session.invalidate();
	}
}
