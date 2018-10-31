package com.example.controller;


import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.JeanRecordRepository;
import com.example.dao.JeansRepository;
import com.example.dao.PacRecordRepository;
import com.example.dao.PackageRepository;
import com.example.dao.PositionRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_package;
import com.example.service.PositionService;

import net.sf.json.JSONObject;


@Controller
public class OutHouse {
	@Autowired
	private PackageRepository packageRepository;
	@Autowired
	private PacRecordRepository pacRecordRepository;
	@Autowired
	private JeansRepository jeansRepository;
	@Autowired
	private JeanRecordRepository jeanRecordRepository;
	@Autowired
	private PositionRepository positionRepository;
	@Autowired
	private PositionService positionService;
	boolean station = false;
	boolean resetStation = true;
	boolean unLock = true;
	boolean lock = false; 
	String str1 = "out success";
	String str2 = "out failed";
	String str3 = "unlock success";
	String str4 = "repeal success";
	AcceptJson acceptJson = new AcceptJson();
	
	//返回给前端模板列表调用方法/backModuleNum
	//前端将裤子加入购物车，后端返回裤子的上锁状态并将未上锁的裤子上锁(将判断状态和更改状态绑定)
	@RequestMapping("/OutHouse/backLockInfo")
	@ResponseBody
	public synchronized JSONObject backLockInfo(@RequestParam("jeansId") String jeansId){
		String[] allJeansId = acceptJson.JsonToString(jeansId);
		List<Object> listJeaLock = new ArrayList<Object>();
		for(int i=0;i<allJeansId.length;i++){
			List<Object> listSinJeaLock = new ArrayList<Object>();
			int jeaId = Integer.parseInt(allJeansId[i]);
			Tb_jeans tb_jeans = jeansRepository.findByJeansId(jeaId);
			boolean myStation = tb_jeans.isLockStation();
			if(myStation==unLock){
				jeansRepository.Lock(jeaId, lock);//给裤子上锁
				listSinJeaLock.add(jeaId);
				listSinJeaLock.add("1");
			}
			else{
				listSinJeaLock.add(jeaId);
				listSinJeaLock.add("0");
			}
			listJeaLock.add(listSinJeaLock);
		}
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("listJeaLock",listJeaLock);
		return jsonobj;
	}
	
	//点击出库，更改裤子出库状态及添加出库时间，更改对应位子信息
	//出库返回所有裤子的详细信息
	@RequestMapping("/OutHouse/deletePackage")
	@ResponseBody
	public JSONObject deletePackage(@RequestParam("username") String username,@RequestParam("jeansId") String jeansId){
		String[] allJeansId = acceptJson.JsonToString(jeansId);
		String outUser = username;
		List<Object> listAll = new ArrayList<Object>();
		listAll.add(str1);
		int p = allJeansId.length/2;
		for(int i=0;i<p;i++){
			int j = 2*i;
			//裤子出库，更新裤子出库状态，并解锁裤子
			int jeaId = Integer.parseInt(allJeansId[j]);
			jeansRepository.updateStation(jeaId, station);
			jeansRepository.unLock(jeaId, unLock);
			//裤子出库，更新裤子现有数量并为裤子记录添加现有数量，出库数量，出库时间及出库账户
			Tb_jeans tb_jeans1 = jeansRepository.findByJeansId(jeaId);
			int outNum = Integer.parseInt(allJeansId[j+1]);
			int nowNum = tb_jeans1.getNowNum();
			int NewNownum = nowNum - outNum;
			jeansRepository.updateNowNum(jeaId, NewNownum);
			
			java.util.Date date = new java.util.Date();
			Timestamp outTime =new Timestamp(date.getTime());
			jeanRecordRepository.addTimeUser(jeaId, NewNownum,outNum,outTime, outUser);
			
			//判断包裹是否出库
			String packageId = tb_jeans1.getPackageId();
			Tb_package tb_package = packageRepository.findBypackageID(packageId);
			int pacNowNum = tb_package.getNowNum()-outNum;
			packageRepository.updateNowNum(packageId, pacNowNum);//裤子出库改变包裹里的裤子现有量
			packageRepository.updateStation(packageId, 2);//裤子出库将包裹状态改为中间态
			List<Tb_jeans> listJeans = jeansRepository.findByPackageId(packageId);
			boolean ifOut = true; 
			for(Tb_jeans tb_jeans:listJeans){
				if(tb_jeans.getStation()==false){
					ifOut = false;
				}
			}
			if(ifOut){
				//包裹出库，更新包裹出库状态
				packageRepository.updateStation(packageId, 1);
				//包裹出库，为包裹记录添加出库时间及出库账户
				pacRecordRepository.addTimeUser(packageId, outTime, outUser);
				//包裹出库更改对应位子使用信息，及位子状态
				String positionInfo = tb_package.getPositionInfo();
				positionRepository.updateOut(positionInfo);
				positionService.updateChangeTime(positionInfo);
			}
			
		}
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo",listAll);
		return jsonobj;
	}
	
	//前端传给后台仓库管理员输入的裤子出库后的包裹里裤子总数校验值,并改变中间态的包裹
	@RequestMapping("/OutHouse/CheckPac")
	@ResponseBody
	public JSONObject CheckPac(@RequestParam("check") String check){
		String[] allCheck = acceptJson.JsonToString(check);
		List<Object> listPac = new ArrayList<Object>();
		int p = allCheck.length/2;
		for(int i=0;i<p;i++){
			int j = 2*i;
			Tb_package tb_package = packageRepository.findBypackageID(allCheck[j]);
			int inputNum = Integer.parseInt(allCheck[j+1]);
			if(tb_package.getNowNum()==inputNum&&tb_package.isIfOut()==2){
				packageRepository.updateStation(allCheck[j], 0);
				listPac.add(allCheck[j]);
			}
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("listPac", listPac);
		return jsonObject;
		
	}
	//前端删除购物车里的裤子或跳转到其他页面时，将购物车里的裤子解锁
	@RequestMapping("/OutHouse/unLockPac")
	@ResponseBody
	public JSONObject unLockPac(@RequestParam("jeaId") String allJeaId){
		String[] jeaId = acceptJson.JsonToString(allJeaId);
		for(int i=0;i<jeaId.length;i++){
			int jeansId = Integer.parseInt(jeaId[i]);
			jeansRepository.unLock(jeansId, unLock);
		}
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo",str3);
		return jsonobj;
	}
	
	//返回所有问题包裹
	@RequestMapping("/OutHouse/backProPac")
	@ResponseBody
	public JSONObject backProPac(){
		List<Tb_package> listProPac = packageRepository.backProPac(false);
		List<Object> listPac = new ArrayList<Object>();
		for(Tb_package tb_package:listProPac){
			List<Object> sinlistPac = new ArrayList<Object>();
			sinlistPac.add(tb_package.getPackageID());
			sinlistPac.add(tb_package.getNowNum());
			listPac.add(sinlistPac);
		}
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo",listPac);
		return jsonobj;
	}
	
	//校验员可以更改问题包裹的裤子数量
	@RequestMapping("/OutHouse/updateProPac")
	@ResponseBody
	public JSONObject updateProPac(@RequestParam("pacID") String pacID){
		String[] allPacId = acceptJson.JsonToString(pacID);
		int p = allPacId.length;
		for(int i=0;i<p;i++){
			int j = 2*i;
			int num = Integer.parseInt(allPacId[j+1]);
			packageRepository.updateNowNum(allPacId[j],num);
			packageRepository.updateStation(allPacId[j], 0);
		}
		JSONObject jsonobj = new JSONObject();
		String str = "success";
		jsonobj.put("backInfo",str);
		return jsonobj;
	}
	
	//出库误操作，出库撤销(必须将更改状态和更改出库时间和出库账户两个动作绑定，时间差很短不存在锁)
	@RequestMapping("/InOutRecordQuery/outRepeal")
	@ResponseBody
	public JSONObject outRepeal(@RequestParam("pacId") String allPacID){
		/*String[] pacId = acceptJson.JsonToString(allPacID);
		for(int i=0;i<pacId.length;i++){
			//更改包裹出库时间及出库账户
			pacRecordRepository.updateTimeUser(pacId[i]);
			//更改包裹的出库状态
			packageRepository.resetStation(pacId[i], resetStation);
			//更改位子使用信息
			Tb_package tb_package = packageRepository.findBypackageID(pacId[i]);
			positionRepository.updateIn(tb_package.getPositionInfo());
		}*/
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo",str4);
		return jsonobj;
	}

}
