package com.example.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dao.BrandRepository;
import com.example.dao.ColourRepository;
import com.example.dao.DepartmentRepository;
import com.example.dao.FittingRepository;
import com.example.dao.ModuleNumRepository;
import com.example.dao.ProviderRepository;
import com.example.dao.SizeRepository;
import com.example.module.Tb_brand;
import com.example.module.Tb_colour;
import com.example.module.Tb_department;
import com.example.module.Tb_fitting;
import com.example.module.Tb_modulenum;
import com.example.module.Tb_provider;
import com.example.module.Tb_size;

import net.sf.json.JSONObject;

@Controller
public class WareManage {
	@Autowired
	private ProviderRepository providerRepository;
	@Autowired
	private ColourRepository colourRepository;
	@Autowired
	private SizeRepository sizeRepository;
	@Autowired
	private FittingRepository fittingRepository;
	@Autowired
	private BrandRepository brandRepository;
	@Autowired
	private DepartmentRepository departmentRepository;
	@Autowired
	private ModuleNumRepository moduleNumRepository;
	
	String str1 = "Exist";
	String str2 = "add success";
	String str = "delete success";
	
	//入库是返回给前端模板列表
	@RequestMapping("/backModuleNum")
	@ResponseBody
    public JSONObject backModuleNum() {
		List<Tb_modulenum> listModuleNum = moduleNumRepository.findAll();
		JSONObject json = new JSONObject();
		List<Object> res = new ArrayList<Object>();
		for(Tb_modulenum tb_modulenum:listModuleNum){
			res.add(tb_modulenum.getModuleNum());
		}
		json.put("moduleNum", res);
		return json;
    }
	//1.返回模板列表------------------------------------------------
	@RequestMapping("/backAllModuleNum")
	@ResponseBody
    public JSONObject backAllModuleNum() {
		List<Tb_modulenum> listModuleNum = moduleNumRepository.findAll();
		JSONObject json = new JSONObject();
		List<Object> res = new ArrayList<Object>();
		for(Tb_modulenum tb_modulenum:listModuleNum){
			List<String> listModule = new ArrayList<String>();
			listModule.add(tb_modulenum.getModuleNum());
			listModule.add(tb_modulenum.getDepartment());
			listModule.add(tb_modulenum.getBrand());
			listModule.add(tb_modulenum.getFitting());
			listModule.add(tb_modulenum.getProvider());
			listModule.add(tb_modulenum.getColour());
			listModule.add(tb_modulenum.getSize());
			res.add(listModule);
		}
		json.put("moduleNum", res);
		return json;
    }
	//货物管理下的模板管理点击添加，则增加模板种类
	@RequestMapping("/Manage/addModuleNum")
	@ResponseBody
	public JSONObject addModuleNum(@RequestParam("moduleNum") String moduleNum,@RequestParam("department") String department,
			@RequestParam("brand") String brand,@RequestParam("fitting") String fitting,
			@RequestParam("provider") String provider,@RequestParam("colour") String colour,
			@RequestParam("size") String size){
		JSONObject jsonobj = new JSONObject();
		List<Tb_modulenum> listModuleNum = moduleNumRepository.findAll();
		//遍历模板列表查看新加的是否存在
		for(Tb_modulenum tb_modulenum:listModuleNum){
			String proInfo = tb_modulenum.getModuleNum();
			if(moduleNum.equals(proInfo)){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_modulenum tb_modulenum = new Tb_modulenum(department, brand, fitting, provider, colour, size,moduleNum);
		moduleNumRepository.save(tb_modulenum);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的模板管理点击删除，则删除对应模板
	@RequestMapping("/Manage/deleteModuleNum")
	@ResponseBody
	public JSONObject deleteModuleNum(@RequestParam("moduleNum") String moduleNum){
		moduleNumRepository.deleteBymoduleNum(moduleNum);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}
	
	//2.返回系列列表------------------------------------------------
	@RequestMapping("/backDepartmentInfo")
	@ResponseBody
    public JSONObject backDepartment() {
		List<Tb_department> listDepartment = departmentRepository.findAll();
		JSONObject json = new JSONObject();
		List<String> res = new ArrayList<String>();
		for(Tb_department tb_department:listDepartment){
			res.add(tb_department.getDepartment());
		}
		json.put("department", res);
		return json;
    }
	//货物管理下的系列管理点击添加，则增加系列种类
	@RequestMapping("/Manage/addDepartment")
	@ResponseBody
	public JSONObject addDepartment(@RequestParam("department") String department){
		String[] string1 = department.split("/");
		JSONObject jsonobj = new JSONObject();
		List<Tb_department> listDepartment = departmentRepository.findAll();
		//遍历系列列表查看新加的是否存在
		for(Tb_department tb_department:listDepartment){
			String proInfo = tb_department.getDepartment();
			String[] string2 = proInfo.split("/");
			if(string1[0].equals(string2[0])||string1[1].equals(string2[1])){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_department tb_department = new Tb_department(department);
		departmentRepository.save(tb_department);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的系列管理点击删除，则删除对应系列
	@RequestMapping("/Manage/deleteDepartment")
	@ResponseBody
	public JSONObject deleteDepartment(@RequestParam("department") String department){
		departmentRepository.deleteBydepartment(department);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}
	
	//3.返回品牌列表------------------------------------------------
	@RequestMapping("/backBrandInfo")
	@ResponseBody
    public JSONObject backBrand() {
		List<Tb_brand> listBrand = brandRepository.findAll();
		JSONObject json = new JSONObject();
		List<String> res = new ArrayList<String>();
		for(Tb_brand tb_brand:listBrand){
			res.add(tb_brand.getBrand());
		}
		json.put("brand", res);
		return json;
    }
	//货物管理下的品牌管理点击添加，则增加品牌种类
	@RequestMapping("/Manage/addBrand")
	@ResponseBody
	public JSONObject addBrand(@RequestParam("brand") String brand){
		String[] string1 = brand.split("/");
		JSONObject jsonobj = new JSONObject();
		List<Tb_brand> listBrand = brandRepository.findAll();
		//遍历品牌列表查看新加的是否存在
		for(Tb_brand tb_brand:listBrand){
			String proInfo = tb_brand.getBrand();
			String[] string2 = proInfo.split("/");
			if(string1[0].equals(string2[0])||string1[1].equals(string2[1])){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_brand tb_brand = new Tb_brand(brand);
		brandRepository.save(tb_brand);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的品牌管理点击删除，则删除对应品牌
	@RequestMapping("/Manage/deleteBrand")
	@ResponseBody
	public JSONObject deleteBrand(@RequestParam("brand") String brand){
		brandRepository.deleteByBrand(brand);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}
	
	//4.返回型号列表------------------------------------------------
	@RequestMapping("/backFittingInfo")
	@ResponseBody
    public JSONObject backFittingInfo() {
		List<Tb_fitting> listFitting = fittingRepository.findAll();
		JSONObject json = new JSONObject();
		List<String> res = new ArrayList<String>();
		for(Tb_fitting tb_fitting:listFitting){
			res.add(tb_fitting.getFitting());
		}
		json.put("fitting", res);
		return json;
    }
	//货物管理下的型号管理点击添加，则增加型号种类
	@RequestMapping("/Manage/addFitting")
	@ResponseBody
	public JSONObject addFitting(@RequestParam("fitting") String fitting){
		String[] string1 = fitting.split("/");
		JSONObject jsonobj = new JSONObject();
		List<Tb_fitting> listFitting = fittingRepository.findAll();
		//遍历型号列表查看新加的是否存在
		for(Tb_fitting tb_fitting:listFitting){
			String proInfo = tb_fitting.getFitting();
			String[] string2 = proInfo.split("/");
			if(string1[0].equals(string2[0])||string1[1].equals(string2[1])){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_fitting tb_fitting = new Tb_fitting(fitting);
		fittingRepository.save(tb_fitting);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的型号管理点击删除，则删除对应型号
	@RequestMapping("/Manage/deleteFitting")
	@ResponseBody
	public JSONObject deleteFitting(@RequestParam("fitting") String fitting){
		fittingRepository.deleteByfitting(fitting);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}
		
	//5.返回供应商列表------------------------------------------------
	@RequestMapping("/backProviderInfo")
	@ResponseBody
    public JSONObject backProviderInfo() {
		List<Tb_provider> listProvider = providerRepository.findAll();
		JSONObject json = new JSONObject();
		List<String> res = new ArrayList<String>();
		for(Tb_provider tb_provider:listProvider){
			res.add(tb_provider.getProvider());
		}
		json.put("provider", res);
		return json;
    }
	//货物管理下的供应商管理点击添加，则增加供应商种类
	@RequestMapping("/Manage/addProviderInfo")
	@ResponseBody
	public JSONObject addProvider(@RequestParam("provider") String provider){
		String[] string1 = provider.split("/");
		JSONObject jsonobj = new JSONObject();
		List<Tb_provider> listProvider = providerRepository.findAll();
		//遍历供应商列表查看新加的是否存在
		for(Tb_provider tb_provider:listProvider){
			String proInfo = tb_provider.getProvider();
			String[] string2 = proInfo.split("/");
			if(string1[0].equals(string2[0])||string1[1].equals(string2[1])){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_provider tb_provider = new Tb_provider(provider);
		providerRepository.save(tb_provider);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的供应商管理点击删除，则删除对应供应商
	@RequestMapping("/Manage/deleteProvider")
	@ResponseBody
	public JSONObject deleteProvider(@RequestParam("provider") String provider){
		providerRepository.deleteByproInfo(provider);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}
	
	//6.返回颜色列表------------------------------------------------
	@RequestMapping("/backColourInfo")
	@ResponseBody
    public JSONObject backColourInfo() {
		List<Tb_colour> listcolour = colourRepository.findAll();
		JSONObject json = new JSONObject();
		List<String> res = new ArrayList<String>();
		for(Tb_colour tb_colour:listcolour){
			res.add(tb_colour.getColourInfo());
		}
		json.put("colour", res);
		return json;
    }
	//货物管理下的颜色管理点击添加,则增加颜色种类
	@RequestMapping("/Manage/addColour")
	@ResponseBody
	public JSONObject addColour(@RequestParam("colour") String colour){
		String[] string1 = colour.split("/");
		JSONObject jsonobj = new JSONObject();
		List<Tb_colour> listColour = colourRepository.findAll();
		//遍历颜色列表查看新加的是否存在
		for(Tb_colour tb_colour:listColour){
			String colourInfo = tb_colour.getColourInfo();
			String[] string2 = colourInfo.split("/");
			if(string1[0].equals(string2[0])||string1[1].equals(string2[1])){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_colour tb_colour = new Tb_colour(colour);
		colourRepository.save(tb_colour);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的颜色管理点击删除，则删除颜色种类
	@RequestMapping("/Manage/deleteColour")
	@ResponseBody
	public JSONObject deleteColour(@RequestParam("colour") String colour){
		colourRepository.deleteByColour(colour);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}
	
	//7.返回尺寸列表------------------------------------------------
	@RequestMapping("/backSizeInfo")
	@ResponseBody
    public JSONObject backSizeInfo() {
		List<Tb_size> listsize = sizeRepository.findAll();
		JSONObject json = new JSONObject();
		List<String> res = new ArrayList<String>();
		for(Tb_size tb_size:listsize){
			res.add(tb_size.getSizeInfo());
		}
		json.put("size", res);
		return json;
    }
	//货物管理下的尺寸管理点击添加,则增加尺寸种类
	@RequestMapping("/Manage/addSize")
	@ResponseBody
	public JSONObject addSize(@RequestParam("size") String size){
		String[] string1 = size.split("/");
		JSONObject jsonobj = new JSONObject();
		List<Tb_size> listSize = sizeRepository.findAll();
		//遍历颜色列表查看新加的是否存在
		for(Tb_size tb_size:listSize){
			String sizeInfo = tb_size.getSizeInfo();
			String[] string2 = sizeInfo.split("/");
			if(string1[0].equals(string2[0])||string1[1].equals(string2[1])){
				jsonobj.put("backInfo", str1);
				return jsonobj;
			}
		}
		Tb_size tb_size = new Tb_size(size);
		sizeRepository.save(tb_size);
		jsonobj.put("backInfo", str2);
		return jsonobj;
	}
	//货物管理下的尺寸管理点击删除，则删除尺寸种类
	@RequestMapping("/Manage/deleteSize")
	@ResponseBody
	public JSONObject deleteSize(@RequestParam("size") String size){
		sizeRepository.deleteBysize(size);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("backInfo", str);
		return jsonobj;
	}		
		
}
