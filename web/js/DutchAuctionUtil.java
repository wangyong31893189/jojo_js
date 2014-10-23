/*
 * @(#)DutchAuctionUtil.java        1.0 2013-1-22
 *
 * Copyright (c) 2007-2013 Shanghai Handpay IT, Co., Ltd.
 * 16/F, 889 YanAn Road. W., Shanghai, China
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of 
 * Shanghai Handpay IT Co., Ltd. ("Confidential Information").  
 * You shall not disclose such Confidential Information and shall use 
 * it only in accordance with the terms of the license agreement you 
 * entered into with Handpay.
 */

package com.handpay.wap.actioin.activity.dutchAuction;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.handpay.core.common.util.DateUtils;
import com.handpay.core.merchant.activity.bean.MerchActivityMdseRuleBaseBean;
import com.handpay.core.merchant.activity.bean.SSJActivityMdseRuleBean;
import com.handpay.core.merchant.activity.bean.SSJMdseDownRuleBean;
import com.handpay.core.merchant.activity.mdse.bean.ActivityMdseBean;
import com.handpay.core.merchant.activity.mdse.bean.ActivityMdseMinSellBean;

/**
 * 时时降数据转换工具
 *
 * @version 	1.0 2013-1-22
 * @author		sjzhou
 * @history	
 *		
 */
public class DutchAuctionUtil {
	private static Logger logger = Logger
			.getLogger(DutchAuctionUtil.class);
	
	
	public  static  void covertMdseRuleToJsonStr(ActivityMdseBean mdseBean) {
		MerchActivityMdseRuleBaseBean mdseRule = mdseBean.getMdseRuleBean();
		JsonArray array = new JsonArray();
		/*if (mdseRule != null) {
			SSJActivityMdseRuleBean ssjRule = (SSJActivityMdseRuleBean) mdseRule;
			List<SSJMdseDownRuleBean> downRuleList = ssjRule.getDownRuleList();
			//JsonArray array = new JsonArray();
				try {
					if (downRuleList != null && downRuleList.size() > 0) {
						SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
						ActivityMdseMinSellBean  sellBean = mdseBean.getActivitySell();
						BigDecimal  mdseSellPrice = null;
						if(sellBean!=null){
							mdseSellPrice = sellBean.getPrice();
						}
						_calcMdseDownTime(sellBean);//计算商品倒计时业务
						
						for (int i = 0; i < downRuleList.size(); i++) {
							SSJMdseDownRuleBean downRule = downRuleList.get(i);
							//当获得商品降价规则的时候，判断规则中是不是有降价后和商品原价一样的情况，如果有，默认跳过当前规则，不做处理，默认为原价信息
							if(downRule.getPrice().compareTo(mdseSellPrice)==0){
								continue;
							}
							String startTime = downRule.getStartTime();
							String endTime = downRule.getEndTime();
							
							String currentTime = DateUtils.getCurrentDate("yyyyMMddHHmmss");
							Integer downTime = downRule.getDownTimes();
							if (downTime!=null) {
									long downTimeInMillis = 0;
									Calendar calender = Calendar.getInstance();
									Calendar calender2 = Calendar.getInstance();
									calender.setTime(format.parse(endTime));
									long endTimeInMillis = calender.getTimeInMillis();
									calender2.setTime(format.parse(currentTime));
									long currentTimeInMillis = calender2.getTimeInMillis();
									
									*//**判断如果当前规则已经在倒计时，那么要用结束时间 减去当前时间，获得还没有倒计时的毫秒数*//*
									if(currentTime.compareTo(startTime)>=0 && currentTime.compareTo(endTime)<=0){
										downTimeInMillis = endTimeInMillis-currentTimeInMillis;
									}else{
										downTimeInMillis = downRule.getDownTimes()*1000;
									}
									if(currentTime.compareTo(startTime)<=0 && currentTime.compareTo(endTime)<=0){//只处理在有效的，当前和以后的规则
											JsonObject json = new JsonObject();
											json.addProperty("index", i+1);
											json.addProperty("endTimeStemp",downTimeInMillis);//毫秒
											json.addProperty("currenTime",currentTime);//毫秒
											json.addProperty("start",startTime);//毫秒
											json.addProperty("end",endTime);//毫秒
											json.addProperty("cutPrice",downRule.getDisCountPrice().toString());
											json.addProperty("endPrice", downRule.getPrice().toString());
											json.addProperty("prevPrice", downRule.getPrevPrice().toString());
											array.add(json);
									}
							}
						}
						logger.debug(mdseBean.getCode()+": 商品降价规则：" + array.toString());
						if(array.size()<=0){//商品已经最低价
							mdseBean.getActivitySell().setMdseSellPriceStatus(ActivityMdseMinSellBean.MINSELLPRICE);
						}
						mdseBean.setMdseRuleJson(array.toString());
					}
				} catch (ParseException e) {
					logger.error("获得商品："+mdseBean.getCode()+" 规则信息异常",e);
				}
		}*/
	}
	
	
	/**判断如果当前商品已经在倒计时，那么要用结束时间 减去当前时间，获得还没有倒计时的毫秒数*/
	private static void _calcMdseDownTime(ActivityMdseMinSellBean  sellBean ) throws ParseException{
		if(sellBean!=null){
			String currentTime = DateUtils.getCurrentDate("yyyyMMddHHmmss");
			String mdseStart = sellBean.getStartTime();
			String mdseEnd = sellBean.getEndTime();
			if(currentTime.compareTo(mdseStart)>=0 && currentTime.compareTo(mdseEnd)<=0){
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
				Calendar calender = Calendar.getInstance();
				Calendar calender2 = Calendar.getInstance();
				calender.setTime(format.parse(mdseEnd));
				long endTimeInMillis = calender.getTimeInMillis();
				calender2.setTime(format.parse(currentTime));
				long currentTimeInMillis = calender2.getTimeInMillis();
				long downStartTemp = endTimeInMillis-currentTimeInMillis;
				sellBean.setStartTimeMillis(downStartTemp);
			}
		}
	}
}
