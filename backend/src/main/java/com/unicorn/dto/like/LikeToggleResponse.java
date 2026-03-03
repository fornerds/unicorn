package com.unicorn.dto.like;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeToggleResponse {

    private boolean isLiked;
    private long likesCount;
}
