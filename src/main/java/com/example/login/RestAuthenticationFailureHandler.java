package com.example.login;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by dell on 2017/4/9.
 */
//当认证失败后返回指定结果
@Component
public class RestAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        // TODO Auto-generated method stub
    	response.sendRedirect("./index?error");
//        response.setContentType("application/x-javascript");
//        response.setCharacterEncoding("UTF-8");
//        response.getWriter().write("{\"result\":\"error\"}");
//        response.getWriter().flush();
    }

}