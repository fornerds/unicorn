package com.unicorn.dto.admin;

import lombok.Data;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Data
public class AdminProductPatchRequest {

    @Size(max = 200)
    private String name;

    private String description;

    @DecimalMin("0")
    private BigDecimal price;

    @Min(0)
    private Integer stock;

    private java.util.List<String> images;

    private String weight;
    private String totalHeight;
    private String operatingTime;
    private String battery;
    private String speed;
    private String shortDescription;
    private String content;
}
