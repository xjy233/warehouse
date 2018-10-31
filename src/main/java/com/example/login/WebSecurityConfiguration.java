package com.example.login;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by dell on 2017/4/9.
 */
//安全框架security的配置类
@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private RestAuthenticationFailureHandler authenticationFailureHandler;
    @Autowired
    private RestAuthenticationSuccessHandler successHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable();// 关闭csrf:Cross-site request forgery跨站请求伪造（便于测试post请求）
//        http.authorizeRequests().anyRequest().authenticated();//所有页面访问都需要先登录
        http.formLogin() // 登陆的设置
                .failureHandler(authenticationFailureHandler) // failure handler登录失败返回结果
                //.successHandler(successHandler) // success handler
                .loginPage("/index")  //使用自定义登录页面
                .loginProcessingUrl("/login")//登录请求的url  default is /login with an HTTP post
                .defaultSuccessUrl("/home.html")//登陆成功后默认的登录跳转页面
                .permitAll(); // permit all authority登录页面允许所有人访问
//        http.authorizeRequests().antMatchers("/*.html").hasAnyAuthority("SUPERUSER","USER","NORMAL");//拦截指定url,放行指定角色
//        http.authorizeRequests().antMatchers("/Manage/*").hasAnyAuthority("SUPERUSER");//拦截指定url,放行指定角色
//        http.authorizeRequests().antMatchers("/InHouse/*").hasAnyAuthority("USER");//拦截指定url,放行指定角色
        http.authorizeRequests().antMatchers("/OutHouse/*").hasAnyAuthority("USER");//拦截指定url,放行指定角色
        http.authorizeRequests().antMatchers("/AllCheck/*").hasAnyAuthority("USER");//拦截指定url,放行指定角色
        http.authorizeRequests().antMatchers("/InOutRecordQuery/*").hasAnyAuthority("SUPERUSER","USER");//拦截指定url,放行指定角色
        http.authorizeRequests().antMatchers("/query/OutQueryInfo").hasAnyAuthority("TRUE");//拦截指定url,放行指定角色
        //http.authorizeRequests().antMatchers("/log").hasRole("USER");//允许哪些页面对所有人开放
        }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);//将userdetailsserviceimple设置为验证用户信息的类
        // auth.inMemoryAuthentication().withUser("user").password("password").roles("USER");//创建一个默认的用户存储在内存中
    }
}