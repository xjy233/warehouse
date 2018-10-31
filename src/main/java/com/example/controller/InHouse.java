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
import com.example.dao.ModuleNumRepository;
import com.example.dao.PositionRepository;
import com.example.dao.ShelfRepository;
import com.example.module.Tb_jeans;
import com.example.module.Tb_jearecord;
import com.example.module.Tb_modulenum;
import com.example.module.Tb_package;
import com.example.module.Tb_pacrecord;
import com.example.module.Tb_position;
import com.example.module.Tb_shelf;
import com.example.service.JeansService;
import com.example.service.PacRecordService;
import com.example.service.PackageService;
import com.example.service.PositionService;
import com.example.service.ShelfService;

import net.sf.json.JSONObject;

@Controller
public class InHouse {
	
	@Autowired
	private PositionRepository positionRepository;
	@Autowired
	private JeansRepository jeansRepository;
	@Autowired
	private ModuleNumRepository moduleNumRepository;
	@Autowired
	private JeanRecordRepository jeanRecordRepository;
	@Autowired
	private PositionService positionService;
	@Autowired
	private JeansService jeansService;
	@Autowired
	private PackageService packageService;
	@Autowired
	private PacRecordService pacRecordService;
	@Autowired
	private ShelfRepository shelfRepository;
	@Autowired
	private ShelfService shelfService;
	
	boolean station1 = true;//定义包裹状态未出库
	boolean station2 = false;//定义包裹状态出库
	String str1 = "already outHouse";//已经出库
	String str2 = "repeal success";//入库撤销成功
	AcceptJson acceptJson = new AcceptJson();
	
	@RequestMapping("/index")
    public String toLogin() {
		return "index";
    }
	
	//返回给前端模板列表调用方法/backModuleNum
	//前端点击add添加裤子时，返回给前端该模板的组合信息
	@RequestMapping("/backModuleInfo")
	@ResponseBody
    public JSONObject backModuleInfo(@RequestParam("moduleNum") String moduleNum) {
		Tb_modulenum tb_modulenum = moduleNumRepository.findByModuleNum(moduleNum);
		JSONObject jsonobj = new JSONObject();
		List<String> listModuleInfo = new ArrayList<String>();
		listModuleInfo.add(moduleNum);
		listModuleInfo.add(tb_modulenum.getDepartment());
		listModuleInfo.add(tb_modulenum.getBrand());
		listModuleInfo.add(tb_modulenum.getFitting());
		listModuleInfo.add(tb_modulenum.getProvider());
		listModuleInfo.add(tb_modulenum.getColour());
		listModuleInfo.add(tb_modulenum.getSize());
		jsonobj.put("moduleInfo", listModuleInfo);
		return jsonobj;
	}
	
	//自定义推荐返回货架列表
	@RequestMapping("/backShelf")
	@ResponseBody
    public JSONObject backShelf() {
		List<String> listShelfNum = shelfService.sortShelfNum();
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("allShelfNum", listShelfNum);
		return jsonobj;
	}
	
	//自定义推荐返回某一货架位子的使用情况
	@RequestMapping("/backPositionUsed")
	@ResponseBody
    public JSONObject backPositionUsed(@RequestParam("shelfNum") String shelfNum) {
		List<Tb_position> listPosition = positionRepository.backAllPos(shelfNum);
		Tb_shelf tb_shelf = shelfRepository.findByShelfNum(shelfNum);
		List<Object> allPos = new ArrayList<Object>();
		allPos.add(tb_shelf.getShelfRow());
		allPos.add(tb_shelf.getShelfCol());
		for(Tb_position tb_position:listPosition){
			String mypositionInfo = tb_position.getPositionInfo().substring(2,5);//获取01104中104位子号
			int myVolume = tb_position.getVolume();
			int myOccupation = tb_position.getOccupation();
			List<Object> singlePos = new ArrayList<Object>();
			singlePos.add(mypositionInfo);
			singlePos.add(myOccupation);
			singlePos.add(myVolume);
			allPos.add(singlePos);
		}
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("listPos", allPos);
		
		return jsonobj;
	}
	
	
	//保存包裹信息及更改位子使用信息，包裹记录信息
	@RequestMapping("/InHouse/savePackage")
	@ResponseBody
    public JSONObject savePackage(@RequestParam("pacList") String pacList) {
		//对接收到的String处理成数组
		String[] myStr = acceptJson.JsonToString(pacList);
		int amount = Integer.parseInt(myStr[0]);
		float weight = Float.parseFloat(myStr[1]);
		String positionInfo = myStr[2];
		String inUser = myStr[3];//获取入库操作的用户账号
		//添加包裹信息
		Tb_package tb_package = new Tb_package(amount,amount,weight, positionInfo, 0, station1);
		String pacID = packageService.add(tb_package);
		//更改位子使用信息并且更改位子状态
		positionService.updateIn(positionInfo);
		positionService.updateChangeTime(positionInfo);
		//添加包裹入库记录
		java.util.Date date = new java.util.Date();
		Timestamp inTime =new Timestamp(date.getTime());
		Tb_pacrecord tb_pacrecord = new Tb_pacrecord(pacID,inTime,inUser);
		pacRecordService.add(tb_pacrecord);
		//添加裤子信息及裤子入库记录
		int jeansNum = (myStr.length-4)/9;
		for(int i=0;i<jeansNum;i++){
			int j = i*9+4;
			String moduleNum = myStr[j];
			String department = myStr[j+1];
			String brand = myStr[j+2];
			String fitting = myStr[j+3];
			String provider = myStr[j+4];
			String size = myStr[j+5];
			String colour = myStr[j+6];
			int number = Integer.parseInt(myStr[j+7]);
			float jeaWeight = Float.parseFloat(myStr[j+8]);
			Tb_jeans tb_jeans = new Tb_jeans(moduleNum, department, brand, fitting, provider, size, colour,
					pacID, number, number, jeaWeight, station1, station1);
			jeansService.add(tb_jeans);
			//添加裤子入库记录
			int jeansid = jeansRepository.getNewId();
			Tb_jearecord tb_jearecord = new Tb_jearecord(jeansid, inTime, inUser, number);
			jeanRecordRepository.save(tb_jearecord);
		}
		//返回包裹ID
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("pacID", pacID);
		return jsonObject;
    }
	
	//入库误操作，入库撤销(判断出库和删除包裹必须绑定)
	@RequestMapping("/InOutRecordQuery/inRepeal")
	@ResponseBody
	public JSONObject inRepeal(@RequestParam("pacId") String allPacID){
		/*String[] pacId = acceptJson.JsonToString(allPacID);
		List<Object> listRepeal = new ArrayList<Object>();
		for(int i=0;i<pacId.length;i++){
			List<Object> listSinRepeal = new ArrayList<Object>();
			packageRepository.lockTable();//判断前先锁表
			Tb_package tb_package = packageRepository.findBypackageID(pacId[i]);
			int myStation = tb_package.isIfOut();
			//判断是否出库，若出库则该包裹不能撤销
			if(myStation==1){
				listSinRepeal.add(pacId[i]);
				listSinRepeal.add("0");
				listRepeal.add(listSinRepeal);
			}
			else {
				packageRepository.deleteByPacID(pacId[i]);//删除包裹
				PacRecordRepository.deleteByPacID(pacId[i]);//删除包裹记录
				jeansRepository.deleteByPacID(pacId[i]);//删除裤子
				positionRepository.updateOut(tb_package.getPositionInfo());//撤销更改位子使用信息
				listSinRepeal.add(pacId[i]);
				listSinRepeal.add("1");
				listRepeal.add(listSinRepeal);
			}
			packageRepository.unlockTable();//更改完信息，解锁
		}*/
		JSONObject jsonObject = new JSONObject();
		//jsonObject.put("listRepeal", listRepeal);
		return jsonObject;
	}
	//存在锁的问题:你判断未出库，但还没来的及删除包裹，就被别人出库了
}
