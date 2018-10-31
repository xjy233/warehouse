package com.example.controller;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.UserRepository;
import com.example.module.Tb_user;

import net.sf.json.JSONObject;

@Controller
public class SendEmail {
	@Autowired
    JavaMailSender mailSender;
    @Autowired
    UserRepository userRepository;
    
    @PostMapping("/returnPassword")
    @ResponseBody
    public JSONObject sendMail(@RequestParam("username") String username){
        final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
        final MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
        JSONObject jsonObject = new JSONObject();
        try {
            message.setFrom("3297449167@qq.com");  //发件邮箱地址（我们的邮箱）
            Tb_user tb_user = userRepository.findByUserName(username);
            String password = tb_user.getPassword();
            if(tb_user.getUserType()==0){
                 message.setTo(tb_user.geteMail());
                 //message.setTo("1187496823@qq.com");
                 message.setSubject("仓储系统-超管密码找回：");     //邮件主题
                 message.setText("内容:你好你的密码是:"+password);    //邮件内容加上验证码
                 this.mailSender.send(mimeMessage);              //发送邮件
            }
            else{
            	Tb_user tb_user2 = userRepository.findByUserName("admin");
                message.setTo(tb_user2.geteMail());
                //message.setTo("1187496823@qq.com");
                message.setSubject("仓储系统-普通用户密码找回：");     //邮件主题
                message.setText("内容:"+"帐号为:"+tb_user.getUsername()+"的用户"+tb_user.getName()+"申请重置密码！");    //邮件内容加上验证码
                this.mailSender.send(mimeMessage);              //发送邮件
            }
        } catch (MessagingException e) {
            e.printStackTrace();
            String str1 = "fail";
            jsonObject.put("backInfo", str1);
            return jsonObject;
        }
        String string = "success";
        jsonObject.put("backInfo", string);
        return jsonObject;
    }

}
