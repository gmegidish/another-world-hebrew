
all: build

clean:
	rm -f 18.asm
	rm -rf resources

resources:
	ts-node index.ts extract

resources/0018.txt.original: resources
	cp resources/0018.txt resources/0018.txt.original

18.asm: resources/0018.txt.original
	ts-node index.ts decompile --file resources/0018.txt.original > 18.asm

build: 18.asm
	echo "// cut" >> 18.asm

	# uncomment to skip introduction directly into IDENTIFICATION
	sed -i '' 's/setvec\t3\tL22cc/setvec\t3\tL190b/g' 18.asm

	# the following is the list of translations
	sed -i '' 's/text\t2\t.*/jsr draw_copyright_peanut/g' 18.asm
	sed -i '' 's/text\t34\t.*/jsr draw_theoretical_study/g' 18.asm
	sed -i '' 's/text\t49\t.*/jsr draw_phase_0/g' 18.asm
	sed -i '' 's/text\t50\t.*/jsr draw_phase_1/g' 18.asm
	sed -i '' 's/text\t51\t.*/jsr draw_phase_2/g' 18.asm
	sed -i '' 's/text\t54\t.*/jsr draw_practical_verification/g' 18.asm
	sed -i '' 's/text\t56\t.*/jsr draw_modification_of_parameters/g' 18.asm
	sed -i '' 's/text\t57\t.*/jsr draw_run_experiment/g' 18.asm
	sed -i '' 's/text\t400\t.*/jsr draw_good_evening_professor/g' 18.asm
	sed -i '' 's/text\t401\t.*/jsr draw_i_see_you_have_driven/g' 18.asm
	sed -i '' 's/text\t402\t.*/jsr draw_identification/' 18.asm
	sed -i '' 's/text\t52\t.*/jsr draw_analysis/' 18.asm
	sed -i '' 's/text\t53\t.*/jsr draw_analysis_result/' 18.asm
	sed -i '' 's/text\t35\t.*/jsr draw_the_experiment_will_begin/' 18.asm

	sed -i '' 's/text\t20\t.*/jsr draw_status_0/' 18.asm
	sed -i '' 's/text\t21\t.*/jsr draw_status_1/' 18.asm
	sed -i '' 's/text\t22\t.*/jsr draw_status_2/' 18.asm
	sed -i '' 's/text\t23\t.*/jsr draw_status_3/' 18.asm
	sed -i '' 's/text\t24\t.*/jsr draw_status_4/' 18.asm

	# move "Y" to beginning of line
	sed -i '' 's/text\t404\t36\t/text 404 8 /' 18.asm

	# countdown texts
	sed -i '' 's/text\t36\t28\t/text 36 13 /' 18.asm
	sed -i '' 's/text\t37\t28\t/text 37 13 /' 18.asm
	sed -i '' 's/text\t38\t28\t/text 38 13 /' 18.asm
	sed -i '' 's/text\t76\t28\t/text 76 13 /' 18.asm
	sed -i '' 's/text\t75\t28\t/text 75 13 /' 18.asm
	sed -i '' 's/text\t39\t28\t/text 39 13 /' 18.asm
	sed -i '' 's/text\t40\t28\t/text 40 13 /' 18.asm
	sed -i '' 's/text\t41\t28\t/text 41 13 /' 18.asm
	sed -i '' 's/text\t42\t28\t/text 42 13 /' 18.asm
	sed -i '' 's/text\t43\t28\t/text 43 13 /' 18.asm

	(cd hebrew-font; ts-node convert-font.ts) >> 18.asm
	ts-node index.ts compile --file 18.asm --outfile resources/0018.txt
	ls -l resources/0018.txt
	ts-node index.ts pack --indir resources --outdir foo

run:
	PWD=$(shell pwd)
	open -a dosbox-x --args -fastlaunch ${PWD}/foo/world.exe
