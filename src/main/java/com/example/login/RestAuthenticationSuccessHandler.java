package com.example.login;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by dell on 2017/4/9.
 */
//，当认证成功后返回指定结果（测试使用）
@Component
public class RestAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        response.setContentType("application/x-javascript");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"result\":\"ok\"}");
        response.getWriter().flush();

    }

}