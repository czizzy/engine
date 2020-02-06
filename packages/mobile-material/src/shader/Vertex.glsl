#include <common>
#include <common_vert>
#include <uv_share>
#include <uv_transform_share_declaration>
#include <uv_transform_vert_declaration>
#include <normal_share>
#include <worldpos_share>
#include <shadow_share>
#include <morph_target_vert>

#include <fog_share>

void main() {

    #include <begin_position_vert>
    #include <begin_normal_vert>

    #include <morph_vert>
    #include <skinning_vert>
    #include <uv_vert>
    #include <uv_transform_vert_chunk>
    #include <normal_vert>
    #include <worldpos_vert>
    #include <shadow_vert>
    #include <position_vert>

    #include <fog_vert>

}
